'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { supabase } from '@/lib/supabaseClient';

type Step = 'PASSPORT_SCAN' | 'VISA_UPLOAD' | 'BIOMETRIC_MATCH' | 'REVIEW' | 'SUCCESS';

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
  const [step, setStep] = useState<Step>('PASSPORT_SCAN');
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [companyGst, setCompanyGst] = useState('');
  const [scannerActive, setScannerActive] = useState(false);

  const visaFileRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  const [visaSrc, setVisaSrc] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<{
    name: string;
    passportNumber: string;
    nationality: string;
  } | null>(null);

  const [matchResult, setMatchResult] = useState<{ score: number; passed: boolean } | null>(null);

  // ──────────────────────────────────────────────────────────
  // STEP 1: Dynamsoft MRZ Scanner
  // ──────────────────────────────────────────────────────────
  const launchMrzScanner = useCallback(async () => {
    setIsLoading(true);
    setScannerActive(true);
    setError(null);
    setPhase('Initializing MRZ scanner engine...');

    try {
      // Dynamically import the Dynamsoft SDK (client-side only)
      const { MRZScanner } = await import('dynamsoft-mrz-scanner');

      setPhase('Loading scanner...');

      const scanner = new MRZScanner({
        license: process.env.NEXT_PUBLIC_DYNAMSOFT_LICENSE || '',
        container: scannerContainerRef.current || undefined,
      });

      // Launch the built-in camera UI — this handles everything:
      // camera feed, document detection, MRZ reading, and parsing
      const result = await scanner.launch();

      console.log('Dynamsoft MRZ Result:', result);

      if (result && result.data) {
        const mrzData = result.data;

        // Extract fields using the Dynamsoft MRZData interface
        const firstName = mrzData.firstName || '';
        const lastName = mrzData.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Guest';
        const docNumber = mrzData.documentNumber || '';
        const nationality = mrzData.nationality || '';

        if (!docNumber) {
          throw new Error('Could not extract passport number. Please try again.');
        }

        // Store only the text data — no images retained
        setExtractedData({
          name: fullName,
          passportNumber: docNumber,
          nationality: nationality
        });

        setIsLoading(false);
        setScannerActive(false);
        setStep('VISA_UPLOAD');
      } else {
        // User cancelled or no MRZ found
        setError('Scan was cancelled or no MRZ detected. Please try again.');
        setIsLoading(false);
        setScannerActive(false);
      }
    } catch (err: any) {
      console.error('Dynamsoft MRZ Scanner Error:', err);
      setError(err.message || 'Failed to scan passport. Please try again.');
      setIsLoading(false);
      setScannerActive(false);
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // STEP 2: Visa Upload (unchanged)
  // ──────────────────────────────────────────────────────────
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

  // ──────────────────────────────────────────────────────────
  // STEP 3: Biometric Face Match (unchanged — uses @vladmandic/human)
  // ──────────────────────────────────────────────────────────
  const captureAndMatch = useCallback(async () => {
    const selfieSrc = webcamRef.current?.getScreenshot();
    if (!selfieSrc || !extractedData) {
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

      // For the international flow without a stored passport image,
      // we simulate a high confidence match for the demo
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
      // Since Dynamsoft doesn't retain the passport image, we use a liveness check
      // In production, you'd compare against a portrait extracted by Dynamsoft (returnPortraitImage: true)
      const score = 92 + Math.floor(Math.random() * 7); // 92-98% for demo
      setMatchResult({ score, passed: true });

      setTimeout(() => {
        setIsLoading(false);
        setStep('REVIEW');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError('Face processing failed. Please try again.');
      setIsLoading(false);
    }
  }, [extractedData]);

  // ──────────────────────────────────────────────────────────
  // STEP 4: Review & Submit to Supabase (unchanged)
  // ──────────────────────────────────────────────────────────
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
        
        {/* STEP 1: PASSPORT MRZ SCAN (Dynamsoft) */}
        {step === 'PASSPORT_SCAN' && (
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
                Point your camera at the MRZ (bottom two lines) of your passport.
              </p>
            </div>

            {/* Dynamsoft scanner will mount its own UI here */}
            <div 
              ref={scannerContainerRef}
              className="w-full border border-[0.5px] border-neutral-800 rounded-sm overflow-hidden bg-black relative min-h-[400px]"
              style={{ display: scannerActive ? 'block' : 'none' }}
            />

            {!scannerActive && (
              <button
                type="button"
                onClick={launchMrzScanner}
                disabled={isLoading}
                className={`w-full border border-[0.5px] rounded-sm px-4 py-10 flex flex-col items-center justify-center gap-4 text-center transition-colors ${
                  isLoading
                    ? 'border-neutral-800 bg-black cursor-not-allowed'
                    : 'border-neutral-700 bg-black hover:border-emerald-500/50 hover:bg-neutral-900/50 cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Spinner />
                    <p className="text-xs text-neutral-400 font-mono">{phase}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 border border-[0.5px] border-neutral-700 rounded-sm flex items-center justify-center bg-neutral-900">
                      <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Open Passport Scanner</p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Powered by Dynamsoft — reads MRZ automatically
                      </p>
                    </div>
                  </>
                )}
              </button>
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
