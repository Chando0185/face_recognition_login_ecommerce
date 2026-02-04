import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import Navbar from '../components/Navbar';
import { User, Mail, Shield, ShoppingBag, Clock, ChevronRight, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userOrders, setUserOrders] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            const allOrders = getStorageItem<any[]>(STORAGE_KEYS.ORDERS, []);
            const filteredOrders = allOrders.filter(o => o.userId === user.id);
            setUserOrders(filteredOrders);
        }
    }, [user]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20">
            <Navbar />

            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Identity Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="glass-morphism-dark p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

                            <div className="relative inline-block mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 mx-auto">
                                    <User className="w-12 h-12 text-primary" />
                                </div>
                                {user.faceDescriptor && (
                                    <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full border-4 border-dark shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                        <ShieldCheck className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{user.name}</h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Verified Personnel</p>

                            <div className="space-y-3 text-left">
                                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <div className="overflow-hidden">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol Email</p>
                                        <p className="text-xs text-white truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Clearance Level</p>
                                        <p className="text-xs text-white">{user.isAdmin ? 'Level 5 (Admin)' : 'Level 1 (Guest)'}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Terminate Session</span>
                            </button>
                        </section>

                        <section className="glass-morphism p-6 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl ${user.faceDescriptor ? 'bg-primary/10 text-primary' : 'bg-gray-700/10 text-gray-600'}`}>
                                    {user.faceDescriptor ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm uppercase">Biometric Link</h4>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                        {user.faceDescriptor ? 'ACTIVE ENROLLMENT' : 'NOT CONFIGURED'}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                        </section>
                    </div>

                    {/* Right Column: Order History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Personnel <span className="text-gradient">Archives</span></h1>
                            <p className="text-gray-400 text-sm mt-2">History of technical acquisition sequences</p>
                        </div>

                        <div className="space-y-4">
                            {userOrders.length > 0 ? (
                                userOrders.map(order => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-morphism-dark p-6 border-white/5 hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-white/5 rounded-xl text-primary">
                                                    <ShoppingBag className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-white uppercase tracking-tighter text-lg">Sequence #{order.id.split('-')[1]}</h3>
                                                    <div className="flex items-center space-x-3 mt-1">
                                                        <span className="flex items-center space-x-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{new Date(order.timestamp).toLocaleDateString()}</span>
                                                        </span>
                                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">{order.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end md:space-x-8">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Value</p>
                                                    <p className="text-xl font-black text-white">${order.total}</p>
                                                </div>
                                                <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                    <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.name}</span>
                                                    <span className="text-[10px] font-black text-primary">×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="glass-morphism p-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <ShoppingBag className="w-10 h-10 text-gray-700" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest">No Sequences Recorded</h3>
                                        <p className="text-gray-500 text-sm mt-2 font-medium">Your acquisition history is currently empty.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="btn-primary py-3 px-8 text-xs uppercase font-black"
                                    >
                                        Initialize Shopping Protocol
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
