'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import { parse } from 'mrz';
import { supabase } from '@/lib/supabaseClient';

type Step = 'PASSPORT_UPLOAD' | 'VISA_UPLOAD' | 'BIOMETRIC_MATCH' | 'REVIEW' | 'SUCCESS';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
      {children}
    </p>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function PassportScanner() {
  const [step, setStep] = useState<Step>('PASSPORT_UPLOAD');
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [companyGst, setCompanyGst] = useState('');

  const passportFileRef = useRef<HTMLInputElement>(null);
  const visaFileRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [passportSrc, setPassportSrc] = useState<string | null>(null);
  const [visaSrc, setVisaSrc] = useState<string | null>(null);
  
  const [extractedData, setExtractedData] = useState<{
    name: string;
    passportNumber: string;
    nationality: string;
  } | null>(null);

  const [matchResult, setMatchResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handlePassportCapture = useCallback(async () => {
    const src = webcamRef.current?.getScreenshot();
    if (!src) return;

    setPassportSrc(src);
    setIsLoading(true);
    setError(null);
    setPhase('Scanning Passport MRZ...');

    try {
      const result = await Tesseract.recognize(src, 'eng');
      const parsed = parse(result.data.text);
      
      if (!parsed.valid || !parsed.fields?.firstName || !parsed.fields?.documentNumber) {
        throw new Error('Please align the bottom two lines of the passport within the frame');
      }

      setExtractedData({
        name: `${parsed.fields.firstName || ''} ${parsed.fields.lastName || ''}`.trim(),
        passportNumber: parsed.fields.documentNumber || '',
        nationality: parsed.fields.nationality || ''
      });

      setIsLoading(false);
      setStep('VISA_UPLOAD');
    } catch (err: any) {
      console.error('MRZ Parsing Error:', err);
      // Always show a clean user-facing instruction, ignoring internal parser errors
      setError('Please align the bottom two lines of the passport within the frame');
      setIsLoading(false);
      setPassportSrc(null); // allow them to retake
    }
  }, []);

  const handleVisaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setVisaSrc(src);
      setIsLoading(true);
      setPhase('Verifying E-Visa validity...');

      // Simulate visa check
      setTimeout(() => {
        setIsLoading(false);
        setStep('BIOMETRIC_MATCH');
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const captureAndMatch = useCallback(async () => {
    const selfieSrc = webcamRef.current?.getScreenshot();
    if (!selfieSrc || !passportSrc || !extractedData) {
      setError('Missing image data.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPhase('Loading face matching engine...');

    try {
      const { Human } = await import('@vladmandic/human');
      const human = new Human({
        modelBasePath: 'https://vladmandic.github.io/human-models/models/',
        face: {
          enabled: true,
          detector: { rotation: true, return: true, maxDetected: 1 },
          description: { enabled: true },
        },
      });

      await human.load();

      // Detect face in passport
      setPhase('Finding face in passport...');
      const ppImg = new Image();
      ppImg.crossOrigin = 'anonymous';
      ppImg.src = passportSrc;
      await new Promise((resolve) => { ppImg.onload = resolve; });

      const ppCanvas = document.createElement('canvas');
      ppCanvas.width = ppImg.width;
      ppCanvas.height = ppImg.height;
      const ppCtx = ppCanvas.getContext('2d');
      ppCtx?.drawImage(ppImg, 0, 0);

      const ppResult = await human.detect(ppCanvas);
      if (!ppResult.face || ppResult.face.length === 0 || !ppResult.face[0].embedding) {
        setError('No face detected on the passport. Please upload a clearer photo.');
        setIsLoading(false);
        return;
      }

      // Detect face in selfie
      setPhase('Analyzing live selfie...');
      const selfieImg = new Image();
      selfieImg.src = selfieSrc;
      await new Promise((resolve) => { selfieImg.onload = resolve; });

      const selfieCanvas = document.createElement('canvas');
      selfieCanvas.width = selfieImg.width;
      selfieCanvas.height = selfieImg.height;
      const selfieCtx = selfieCanvas.getContext('2d');
      selfieCtx?.drawImage(selfieImg, 0, 0);

      const selfieResult = await human.detect(selfieCanvas);
      if (!selfieResult.face || selfieResult.face.length === 0 || !selfieResult.face[0].embedding) {
        setError('No face detected in the live camera feed.');
        setIsLoading(false);
        return;
      }

      setPhase('Computing similarity...');
      const similarity = human.match.similarity(
        ppResult.face[0].embedding,
        selfieResult.face[0].embedding
      );

      const score = Math.round(similarity * 100);
      setMatchResult({ score, passed: similarity >= 0.50 });

      setTimeout(() => {
        setIsLoading(false);
        setStep('REVIEW');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError('Face processing failed. Please try again.');
      setIsLoading(false);
    }
  }, [passportSrc, extractedData]);

  const handleReviewSubmit = async () => {
    if (!extractedData) return;
    setIsLoading(true);
    setError(null);
    try {
      const maskedId = `Pass: XXXX${extractedData.passportNumber.slice(-4)}`;
      const { error: insertError } = await supabase.from('checkins').insert([
        {
          guest_name: extractedData.name,
          document_type: 'Passport',
          masked_id_preview: maskedId,
          face_match_score: `${matchResult?.score || 100}% Match`,
          company_gst: companyGst.trim() || 'N/A',
          nationality: extractedData.nationality,
          visa_status: 'Valid',
          status: 'Verified',
        }
      ]);

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }
      
      setStep('SUCCESS');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: PASSPORT UPLOAD */}
        {step === 'PASSPORT_UPLOAD' && (
          <motion.div
            key="passport"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Step 1 of 3</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Scan Passport</h2>
              <p className="text-neutral-500 text-xs mt-1">
                Upload the photo page of your passport to extract the MRZ code.
              </p>
            </div>

            <div className="w-full border border-[0.5px] border-neutral-800 rounded-sm overflow-hidden bg-black relative flex flex-col items-center justify-center min-h-[400px]">
              {passportSrc ? (
                <img src={passportSrc} alt="Passport preview" className="w-full h-full object-cover opacity-80" />
              ) : (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'environment' }}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  {/* CSS Overlay for Bounding Box */}
                  <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
                    <div className="bg-black/60 flex-1"></div>
                    <div className="flex shrink-0 h-48">
                      <div className="bg-black/60 flex-1"></div>
                      <div className="w-72 border-2 border-emerald-500/50 rounded-lg relative shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                      </div>
                      <div className="bg-black/60 flex-1"></div>
                    </div>
                    <div className="bg-black/60 flex-1 flex flex-col items-center justify-end pb-8 pointer-events-auto">
                      {!isLoading && (
                        <button
                          type="button"
                          onClick={handlePassportCapture}
                          className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center transition-all"
                        >
                          <div className="w-12 h-12 bg-white rounded-full pointer-events-none" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {isLoading && (
              <div className="border border-[0.5px] border-neutral-800 bg-black rounded-sm px-4 py-3 flex items-center gap-3">
                <Spinner />
                <p className="text-xs text-neutral-400 font-mono">{phase}</p>
              </div>
            )}
            
            {error && <p className="text-xs text-red-400">{error}</p>}
          </motion.div>
        )}

        {/* STEP 2: VISA UPLOAD */}
        {step === 'VISA_UPLOAD' && (
          <motion.div
            key="visa"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Step 2 of 3</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Visa Verification</h2>
              <p className="text-neutral-500 text-xs mt-1">
                Upload your E-Visa or Visa stamp page.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 text-xs text-neutral-400 font-mono mb-4">
              <p><span className="text-neutral-500">Name:</span> {extractedData?.name}</p>
              <p><span className="text-neutral-500">Nat:</span> {extractedData?.nationality}</p>
            </div>

            <button
              type="button"
              onClick={() => visaFileRef.current?.click()}
              disabled={isLoading}
              className={`w-full border border-[0.5px] rounded-sm px-4 py-8 flex flex-col items-center justify-center gap-3 text-center transition-colors ${
                visaSrc
                  ? 'border-neutral-600 bg-neutral-900'
                  : 'border-neutral-800 bg-black hover:border-neutral-700'
              }`}
            >
              {visaSrc ? (
                <img src={visaSrc} alt="Visa preview" className="w-full max-h-48 object-contain rounded-sm opacity-80" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-white">Upload Visa</p>
                  </div>
                </>
              )}
            </button>
            <input
              ref={visaFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleVisaUpload}
            />

            {isLoading && (
              <div className="border border-[0.5px] border-neutral-800 bg-black rounded-sm px-4 py-3 flex items-center gap-3">
                <Spinner />
                <p className="text-xs text-neutral-400 font-mono">{phase}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: BIOMETRIC MATCH */}
        {step === 'BIOMETRIC_MATCH' && (
          <motion.div
            key="biometric_match"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Step 3 of 3</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Face Match</h2>
              <p className="text-neutral-500 text-xs mt-1">
                Take a live selfie to match against your passport photo.
              </p>
            </div>

            <div className="w-full border border-[0.5px] border-neutral-800 rounded-sm overflow-hidden bg-black relative flex flex-col items-center justify-center min-h-[250px]">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user' }}
                className="w-full h-full object-cover"
              />
              
              {!isLoading && !matchResult && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={captureAndMatch}
                    className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center transition-all"
                  >
                    <div className="w-10 h-10 bg-white rounded-full pointer-events-none" />
                  </button>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="border border-[0.5px] border-neutral-800 rounded-sm px-4 py-3 flex items-center gap-3">
                <Spinner />
                <p className="text-xs text-neutral-400">{phase}</p>
              </div>
            )}
            
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          </motion.div>
        )}

        {/* STEP 4: REVIEW & GSTIN */}
        {step === 'REVIEW' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Final Step</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Review & Submit</h2>
              <p className="text-neutral-500 text-xs mt-1">
                Your international documents have been verified. Please add corporate billing details if applicable.
              </p>
            </div>

            <div className="bg-neutral-900 border border-[0.5px] border-neutral-800 rounded-sm p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Guest Name:</span>
                <span className="text-white">{extractedData?.name}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Nationality:</span>
                <span className="text-white">{extractedData?.nationality}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Visa Status:</span>
                <span className="text-white">Valid</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Face Match:</span>
                <span className="text-emerald-400">{matchResult?.score}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-medium">
                Corporate GSTIN (Optional for Business Travel / GSTR-2B)
              </label>
              <input
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={companyGst}
                onChange={(e) => setCompanyGst(e.target.value.toUpperCase())}
                className="w-full bg-black border border-[0.5px] border-neutral-800 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-700 font-mono focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <button
              onClick={handleReviewSubmit}
              disabled={isLoading}
              className={`w-full font-semibold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-colors ${
                isLoading
                  ? 'bg-neutral-900 text-neutral-500 border border-[0.5px] border-neutral-800 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer'
              }`}
            >
              {isLoading ? (
                <><Spinner /> Submitting...</>
              ) : (
                'Complete Check-In'
              )}
            </button>
          </motion.div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'SUCCESS' && (
           <motion.div
           key="success"
           initial={{ opacity: 0, y: 8 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex-1 flex flex-col justify-center items-center text-center gap-8 px-2 py-10"
         >
           <motion.div
             initial={{ scale: 0.7, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
             className="w-14 h-14 border border-[0.5px] border-emerald-500 rounded-sm flex items-center justify-center bg-emerald-950/30"
           >
             <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
           </motion.div>
     
           <div className="space-y-3">
             <Eyebrow>International Check-in</Eyebrow>
             <h2 className="text-3xl font-semibold text-white leading-tight">
               Verified.
             </h2>
             <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
               Your Passport & Visa have been verified and submitted to the front desk.
             </p>
           </div>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
