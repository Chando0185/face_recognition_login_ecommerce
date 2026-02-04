import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import confetti from 'canvas-confetti';

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark flex flex-col items-center justify-center -mt-20">
            <Navbar />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full mb-10 relative"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-500 relative z-10" />
                    <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
                        Access <span className="text-green-500">Granted</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide mb-12 max-w-xl mx-auto">
                        Your neural hardware is being synchronized. Preparation for logistics is now active.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-morphism-dark p-8 flex flex-col items-center text-center space-y-3"
                    >
                        <Package className="w-8 h-8 text-primary" />
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol ID</p>
                            <p className="font-mono text-xl text-white font-bold">#{orderNumber}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="glass-morphism-dark p-8 flex flex-col items-center text-center space-y-3 border-green-500/20"
                    >
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Link Status</p>
                            <p className="font-bold text-xl text-white uppercase tracking-tighter">SECURED</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary py-4 px-12 text-sm flex items-center space-x-3 group"
                    >
                        <span>Return to Interface</span>
                        <Home className="w-4 h-4" />
                    </button>
                    <button className="px-12 py-4 glass-morphism text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center space-x-2">
                        <span>Track Logistics</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;
