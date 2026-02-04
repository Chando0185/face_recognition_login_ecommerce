import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, RefreshCw, UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaceAuthProps {
    mode: 'login' | 'register';
    onSuccess: (descriptor: number[], name?: string) => void;
    userName?: string;
}

const FaceAuth: React.FC<FaceAuthProps> = ({ mode, onSuccess, userName }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'detecting' | 'processing' | 'success' | 'error'>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                // @vladmandic/face-api uses the same model format
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setIsModelLoaded(true);
            } catch (err) {
                console.error('Error loading face-api models:', err);
                setError('Failed to load neural models. Ensure models are provided.');
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (isCameraReady && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraReady, stream]);

    const startVideo = async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
            setStream(mediaStream);
            setIsCameraReady(true);
        } catch (err) {
            console.error('Error accessing webcam:', err);
            setError('Camera access denied or hardware not found.');
        }
    };

    const captureFace = async () => {
        if (!videoRef.current || !isModelLoaded) return;

        setStatus('processing');
        setError(null);

        try {
            // Wait for clean frame
            await new Promise(resolve => setTimeout(resolve, 1000));

            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                setStatus('success');
                // Ensure we convert TypedArray to plain number array for storage
                const descriptorArray = Array.from(detections.descriptor);
                console.log('[FaceAuth] Capture successful, descriptor length:', descriptorArray.length);
                onSuccess(descriptorArray, userName);
            } else {
                setStatus('error');
                setError('Neural Scan Failed: No face detected. Ensure face is centered and lit.');
            }
        } catch (err) {
            console.error('Detection error:', err);
            setStatus('error');
            setError('Biometric processing error. Please retry.');
        }
    };

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    {!isCameraReady ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-dark-lighter">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Camera className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Quantum Scanner Offline</p>
                            <button onClick={startVideo} className="btn-primary py-2.5 px-8 text-sm uppercase font-black">
                                Engage Camera
                            </button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                            <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 m-8 rounded-lg border-dashed animate-pulse"></div>
                            {/* Scanning Line Effect */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_#00d2ff] z-10 pointer-events-none"
                            />
                        </>
                    )}

                    <AnimatePresence>
                        {status === 'processing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
                            >
                                <div className="relative">
                                    <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                                    <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
                                </div>
                                <span className="text-xs font-black mt-6 tracking-[0.3em] text-primary uppercase animate-pulse">Extracting Biometrics...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-3"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <button
                    onClick={captureFace}
                    disabled={status === 'processing' || !isCameraReady || !isModelLoaded}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-300 ${status === 'processing' || !isCameraReady || !isModelLoaded
                        ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] shadow-xl'
                        }`}
                >
                    {status === 'processing' ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : mode === 'register' ? (
                        <><UserPlus className="w-5 h-5" /> <span>Establish Identity</span></>
                    ) : (
                        <><ShieldCheck className="w-5 h-5" /> <span>Verify Biometrics</span></>
                    )}
                </button>

                {!isModelLoaded && !error && (
                    <div className="flex flex-col items-center space-y-2 py-2">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 3 }}
                                className="h-full bg-primary"
                            />
                        </div>
                        <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-widest">
                            Synchronizing neural networks...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceAuth;
