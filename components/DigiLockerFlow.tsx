'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { supabase } from '@/lib/supabaseClient';

type Step = 'ID_INPUT' | 'OTP' | 'PROFILE_FETCH' | 'BIOMETRIC_MATCH' | 'REVIEW' | 'SUCCESS';

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

export default function DigiLockerFlow() {
  const [step, setStep] = useState<Step>('ID_INPUT');
  const [idNumber, setIdNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyGst, setCompanyGst] = useState('');
  
  // Webcam matching state
  const webcamRef = useRef<Webcam>(null);
  const [matchResult, setMatchResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleIdSubmit = () => {
    if (idNumber.length < 12) {
      setError('Please enter a valid 12-digit ID number');
      return;
    }
    setError(null);
    setIsLoading(true);
    // Simulate network request to gateway
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otp !== '123456') {
      setError('Invalid OTP. For this POC, use 123456');
      return;
    }
    setError(null);
    setIsLoading(true);
    setStep('PROFILE_FETCH');
    
    // Simulate fetching XML payload from gateway
    setTimeout(() => {
      setIsLoading(false);
      setStep('BIOMETRIC_MATCH');
    }, 2500);
  };

  const captureAndMatch = useCallback(async () => {
    const selfieSrc = webcamRef.current?.getScreenshot();
    if (!selfieSrc) {
      setError('Could not capture image. Please check camera permissions.');
      return;
    }

    setIsLoading(true);
    setError(null);

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

      const img = new Image();
      img.src = selfieSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      const result = await human.detect(canvas);

      if (!result.face || result.face.length === 0) {
        setError('No face detected. Please ensure you are clearly visible.');
        setIsLoading(false);
        return;
      }

      // Simulate a high confidence match against the "government profile"
      // In a real scenario, we would compare the embeddings. Here we prove the tech works by detecting the face.
      const simulatedConfidence = Math.floor(Math.random() * (98 - 85 + 1)) + 85; 

      setMatchResult({ score: simulatedConfidence, passed: true });
      setTimeout(() => {
        setIsLoading(false);
        setStep('REVIEW');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError('Face processing failed. Please try again.');
      setIsLoading(false);
    }
  }, [idNumber]);

  const handleReviewSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const maskedId = `XXXX-XXXX-${idNumber.slice(-4)}`;
      const { error: insertError } = await supabase.from('checkins').insert([
        {
          guest_name: 'Verified Resident',
          document_type: 'Government ID (OKYC)',
          masked_id_preview: maskedId,
          face_match_score: `${matchResult?.score || 100}% Match`,
          company_gst: companyGst.trim() || 'N/A',
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
        {/* STEP 1: ID INPUT */}
        {step === 'ID_INPUT' && (
          <motion.div
            key="id_input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Enterprise Gateway</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Government ID Verification</h2>
              <p className="text-neutral-500 text-xs mt-1">
                Enter your 12-digit ID number to securely fetch your OKYC profile.
              </p>
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="XXXX XXXX XXXX"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="w-full bg-black border border-[0.5px] border-neutral-800 rounded-sm px-4 py-4 text-sm text-white placeholder-neutral-600 font-mono tracking-widest focus:outline-none focus:border-neutral-500 transition-colors text-center"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              onClick={handleIdSubmit}
              disabled={isLoading || idNumber.length < 12}
              className={`w-full font-semibold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-colors ${
                isLoading || idNumber.length < 12
                  ? 'bg-neutral-900 text-neutral-500 border border-[0.5px] border-neutral-800 cursor-not-allowed'
                  : 'bg-white hover:bg-neutral-200 text-black cursor-pointer'
              }`}
            >
              {isLoading ? (
                <><Spinner /> Connecting to Gateway...</>
              ) : (
                'Send OTP'
              )}
            </button>
          </motion.div>
        )}

        {/* STEP 2: OTP */}
        {step === 'OTP' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Verification</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Enter OTP</h2>
              <p className="text-neutral-500 text-xs mt-1">
                A One-Time Password has been sent to your registered mobile number.
              </p>
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-black border border-[0.5px] border-neutral-800 rounded-sm px-4 py-4 text-2xl text-white placeholder-neutral-800 font-mono tracking-[0.5em] focus:outline-none focus:border-neutral-500 transition-colors text-center"
              />
            </div>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <button
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.length < 6}
              className={`w-full font-semibold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-colors ${
                isLoading || otp.length < 6
                  ? 'bg-neutral-900 text-neutral-500 border border-[0.5px] border-neutral-800 cursor-not-allowed'
                  : 'bg-white hover:bg-neutral-200 text-black cursor-pointer'
              }`}
            >
              {isLoading ? (
                <><Spinner /> Verifying...</>
              ) : (
                'Confirm Identity'
              )}
            </button>
          </motion.div>
        )}

        {/* STEP 3: PROFILE FETCH SIMULATION */}
        {step === 'PROFILE_FETCH' && (
          <motion.div
            key="profile_fetch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <Spinner />
            <div className="text-center">
              <p className="text-sm font-medium text-white mb-1">Fetching OKYC XML Payload</p>
              <p className="text-xs text-neutral-500">Retrieving encrypted profile data...</p>
            </div>
          </motion.div>
        )}

        {/* STEP 4: BIOMETRIC MATCH */}
        {step === 'BIOMETRIC_MATCH' && (
          <motion.div
            key="biometric_match"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Eyebrow>Security Check</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Liveness Match</h2>
              <p className="text-neutral-500 text-xs mt-1">
                We need to verify you match the photo retrieved from your government profile.
              </p>
            </div>

            {/* Dummy Profile Photo vs Webcam */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] uppercase text-neutral-500 text-center">Govt Photo</span>
                <div className="aspect-square bg-neutral-900 border border-[0.5px] border-neutral-800 rounded-sm overflow-hidden flex items-center justify-center relative">
                  {/* Generic placeholder avatar to simulate a government photo */}
                  <svg className="w-16 h-16 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[8px] uppercase text-emerald-400 font-mono">Verified OKYC</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] uppercase text-emerald-500 text-center font-semibold">Live Camera</span>
                <div className="aspect-square bg-black border border-[0.5px] border-emerald-800 rounded-sm overflow-hidden relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    className="w-full h-full object-cover"
                  />
                  {matchResult && (
                    <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-400 font-mono font-bold text-lg">{matchResult.score}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            {!matchResult && (
               <div className="flex justify-center mt-4">
                 <button
                   type="button"
                   onClick={captureAndMatch}
                   disabled={isLoading}
                   className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                 >
                   {isLoading ? (
                     <Spinner />
                   ) : (
                     <div className="w-10 h-10 bg-white rounded-full pointer-events-none" />
                   )}
                 </button>
               </div>
            )}
          </motion.div>
        )}

        {/* STEP 4.5: REVIEW & GSTIN */}
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
                Your identity has been verified. Please add any corporate billing details before checking in.
              </p>
            </div>

            <div className="bg-neutral-900 border border-[0.5px] border-neutral-800 rounded-sm p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Guest Name:</span>
                <span className="text-white">Verified Resident</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Document:</span>
                <span className="text-white">Govt ID (OKYC)</span>
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
             <Eyebrow>Check-in Complete</Eyebrow>
             <h2 className="text-3xl font-semibold text-white leading-tight">
               Identity<br />Verified.
             </h2>
             <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
               Your digital profile has been securely synced with the front desk.
             </p>
           </div>
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
