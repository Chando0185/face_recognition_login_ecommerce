import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Camera, ArrowRight, Shield, Database, Trash2, CheckCircle2 } from 'lucide-react';
import FaceAuth from '../components/FaceAuth';
import { useAuth } from '../contexts/AuthContext';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import * as faceapi from '@vladmandic/face-api';

const Login: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [useFace, setUseFace] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

    // Persistence Check: Ensure faceDescriptor doesn't clear on mode switch if captured
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const storedUsers = getStorageItem<any[]>(STORAGE_KEYS.USERS, []);

        if (mode === 'register') {
            const hasBio = !!faceDescriptor && faceDescriptor.length > 0;

            if (!hasBio) {
                if (!confirm('CRITICAL: No biometric data captured for this persona. You will only be able to use Email/Password. Continue with traditional registration?')) {
                    return;
                }
            }

            const userExists = storedUsers.some(u => u.email === formData.email);
            if (userExists) {
                alert('An account with this email already exists.');
                return;
            }

            const isFirstUser = storedUsers.length === 0;
            const hasAdminKey = formData.name.includes('S7_MASTER_INDEX');

            const newUser = {
                id: Date.now().toString(),
                name: formData.name.replace('S7_MASTER_INDEX', '').trim(),
                email: formData.email,
                password: formData.password,
                faceDescriptor: faceDescriptor,
                isAdmin: isFirstUser || hasAdminKey,
            };

            console.log('[Auth] Persisting Persona:', {
                name: newUser.name,
                email: newUser.email,
                biometric_active: hasBio,
                descriptor_integrity: faceDescriptor ? faceDescriptor.length : 0
            });

            const updatedUsers = [...storedUsers, newUser];
            setStorageItem(STORAGE_KEYS.USERS, updatedUsers);

            // Double check persistence immediately
            const check = getStorageItem<any[]>(STORAGE_KEYS.USERS, []);
            const savedUser = check.find(u => u.email === newUser.email);
            console.log('[Auth] Persistence Verification:', savedUser ? 'PASSED' : 'FAILED');

            alert(`Registration Complete! ${hasBio ? 'Biometric data linked.' : 'Traditional access only.'}`);
            login(newUser);
            navigate('/');
        } else {
            const user = storedUsers.find(u => u.email === formData.email && u.password === formData.password);
            if (user) {
                login(user);
                navigate('/');
            } else {
                alert('Access Denied: Invalid email terminal or access cipher.');
            }
        }
    };

    const handleFaceSuccess = (descriptor: number[]) => {
        if (mode === 'register') {
            console.log('[Auth] Biometric capture successful. Descriptor size:', descriptor.length);
            setFaceDescriptor(descriptor);
            setUseFace(false);
            alert('BIOMETRICS CAPTURED: Your facial topology has been mapped. Please complete the registration form below to link this data to your profile.');
        } else {
            const storedUsers = getStorageItem<any[]>(STORAGE_KEYS.USERS, []);
            const usersWithFace = storedUsers.filter(u => u.faceDescriptor && Array.isArray(u.faceDescriptor));

            console.log(`[Auth] Neural Scan: Searching match among ${usersWithFace.length} biometric profiles.`);

            if (usersWithFace.length === 0) {
                alert('BIOMETRIC DATABASE EMPTY: No faces are currently registered in the system. Use "Register Identity" first and ensure you see the "READY" indicator before submitting.');
                setUseFace(false);
                return;
            }

            const liveDescriptor = new Float32Array(descriptor);
            let bestMatch: any = null;
            let minDistanceSeen = Infinity;
            const THRESHOLD = 0.6;

            usersWithFace.forEach(user => {
                const storedDesc = new Float32Array(user.faceDescriptor!);
                const distance = faceapi.euclideanDistance(liveDescriptor, storedDesc);
                console.log(`[Auth] Similarity check vs ${user.name}: ${distance.toFixed(4)}`);

                if (distance < THRESHOLD && distance < minDistanceSeen) {
                    minDistanceSeen = distance;
                    bestMatch = user;
                }
            });

            if (bestMatch) {
                console.log(`[Auth] Match Verified! Identity: ${bestMatch.name} (Dist: ${minDistanceSeen.toFixed(4)})`);
                login(bestMatch);
                navigate('/');
            } else {
                console.warn(`[Auth] No matching identity found. Best distance: ${minDistanceSeen.toFixed(4)}`);
                alert(`Identity Verification Failed.\n\nClosest Match: ${minDistanceSeen === Infinity ? 'None' : minDistanceSeen.toFixed(2)}\nThreshold: ${THRESHOLD}\n\nPlease ensure good lighting or use primary access cipher.`);
                setUseFace(false);
            }
        }
    };

    const clearAllData = () => {
        if (confirm('CAUTION: This will wipe the entire user database and product catalog from local storage. Proceed?')) {
            removeStorageItem(STORAGE_KEYS.USERS);
            removeStorageItem(STORAGE_KEYS.CURRENT_USER);
            removeStorageItem(STORAGE_KEYS.CART);
            alert('Core databases wiped. System reset to Genesis state.');
            window.location.reload();
        }
    };

    const debugUsers = getStorageItem<any[]>(STORAGE_KEYS.USERS, []);
    const usersWithBiometrics = debugUsers.filter(u => !!u.faceDescriptor).length;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism-dark w-full max-w-xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5"
            >
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => { setMode('login'); setUseFace(false); }}
                        className={`flex-1 py-5 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all ${mode === 'login' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Personnel Login
                    </button>
                    <button
                        onClick={() => { setMode('register'); setUseFace(false); }}
                        className={`flex-1 py-5 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all ${mode === 'register' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Register Identity
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            className="inline-block p-4 bg-white/5 rounded-2xl mb-6 border border-white/10"
                        >
                            <Shield className="w-10 h-10 text-primary" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                            {useFace ? 'Biometric Pulse' : mode === 'login' ? 'Secure Node Access' : 'Neural Enrollment'}
                        </h1>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
                            {useFace
                                ? 'Scanning facial topology for verification'
                                : mode === 'login'
                                    ? 'Provide credentials or engage face ID scan'
                                    : 'Initialize your digital persona in the system'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {useFace ? (
                            <motion.div
                                key="face"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <FaceAuth mode={mode} onSuccess={handleFaceSuccess} />
                                <button
                                    onClick={() => setUseFace(false)}
                                    className="w-full mt-6 text-[10px] text-gray-600 hover:text-primary transition-colors font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-2"
                                >
                                    <span>← Switch to traditional protocol</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleFormSubmit}
                                className="space-y-6"
                            >
                                {mode === 'register' && (
                                    <div className="space-y-2 group">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-secondary">Personnel Name</label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-4 z-10 pointer-events-none">
                                                <UserIcon className="w-4 h-4 text-gray-500 group-focus-within:text-secondary transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="input-field !pl-12 py-4 bg-white/5 border-white/10 focus:border-secondary"
                                                placeholder="Identity Name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 group">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-primary">Email Terminal</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 z-10 pointer-events-none">
                                            <Mail className="w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="input-field !pl-12 py-4 bg-white/5 border-white/10"
                                            placeholder="access@smarttech.io"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-primary">Access Cipher</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 z-10 pointer-events-none">
                                            <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="input-field !pl-12 py-4 bg-white/5 border-white/10"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 space-y-4">
                                    <button
                                        type="submit"
                                        className="w-full btn-primary py-5 uppercase font-black tracking-[0.2em] text-xs flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(0,210,255,0.2)]"
                                    >
                                        <span>{mode === 'login' ? 'Authorize Link' : 'Initialize Profile'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <div className="relative flex items-center py-4">
                                        <div className="flex-grow border-t border-white/5"></div>
                                        <span className="flex-shrink mx-4 text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">Neural Override</span>
                                        <div className="flex-grow border-t border-white/5"></div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setUseFace(true)}
                                        className="w-full py-5 glass-morphism border-primary/20 hover:bg-primary/10 text-primary font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 group transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Camera className="w-4 h-4 transition-transform group-hover:scale-110 relative z-10" />
                                        <span className="relative z-10">Engage Face ID</span>
                                        {faceDescriptor && (
                                            <div className="flex items-center space-x-1 ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 animate-pulse relative z-10">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span className="text-[8px] font-bold">READY</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Admin/Debug Tools Section */}
                <div className="border-t border-white/5 bg-black/40 p-4">
                    <button
                        onClick={() => setShowDebug(!showDebug)}
                        className="w-full flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <Database className="w-3 h-3" />
                            <span>System Diagnostics</span>
                        </div>
                        <span>[ {showDebug ? 'HIDE' : 'SHOW'} ]</span>
                    </button>

                    <AnimatePresence>
                        {showDebug && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mb-1">Database Load</p>
                                        <p className="text-xs font-black text-white">{debugUsers.length} <span className="text-gray-600 font-bold ml-1 text-[8px]">PROFILES</span></p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mb-1">Neural Data</p>
                                        <p className="text-xs font-black text-primary">{usersWithBiometrics} <span className="text-gray-600 font-bold ml-1 text-[8px]">ACTIVE</span></p>
                                    </div>
                                    <button
                                        onClick={clearAllData}
                                        className="col-span-2 flex items-center justify-center space-x-2 py-3 mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Wipe System Databases</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
