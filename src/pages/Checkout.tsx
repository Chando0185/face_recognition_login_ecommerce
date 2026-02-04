import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldCheck, CreditCard, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

const Checkout: React.FC = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [address, setAddress] = useState({
        street: '',
        city: '',
        zip: '',
        country: 'United States'
    });

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const newOrder = {
            id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            userId: user?.id,
            userName: user?.name,
            items: cart,
            total: cartTotal + 25,
            address,
            timestamp: new Date().toISOString(),
            status: 'Processing'
        };

        // Simulate payment processing flow
        setTimeout(() => {
            const storedOrders = getStorageItem<any[]>(STORAGE_KEYS.ORDERS, []);
            setStorageItem(STORAGE_KEYS.ORDERS, [newOrder, ...storedOrders]);

            clearCart();
            navigate('/order-success');
        }, 2500);
    };

    if (cart.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <Navbar />
                <h1 className="text-4xl font-black">YOUR TERMINAL IS EMPTY</h1>
                <button onClick={() => navigate('/')} className="mt-8 btn-primary px-8">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark">
            <Navbar />

            <div className="container mx-auto px-6 max-w-6xl">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel Sequence</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-morphism-dark p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Truck className="w-32 h-32" />
                            </div>

                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping <span className="text-primary">Destination</span></h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Street Address</label>
                                    <input
                                        required
                                        className="input-field py-3.5 bg-white/5 border-white/10"
                                        placeholder="Neural Way 101"
                                        value={address.street}
                                        onChange={e => setAddress({ ...address, street: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                                    <input
                                        required
                                        className="input-field py-3.5 bg-white/5 border-white/10"
                                        placeholder="Cybercity"
                                        value={address.city}
                                        onChange={e => setAddress({ ...address, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Archive Code (ZIP)</label>
                                    <input
                                        required
                                        className="input-field py-3.5 bg-white/5 border-white/10"
                                        placeholder="90210"
                                        value={address.zip}
                                        onChange={e => setAddress({ ...address, zip: e.target.value })}
                                    />
                                </div>
                            </form>
                        </section>

                        <section className="glass-morphism-dark p-8 md:p-12">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-secondary" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Payment <span className="text-secondary">Gateway</span></h2>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-secondary/50 transition-colors cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/10">
                                        <ShieldCheck className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white uppercase tracking-tighter">Biometric Encrypted Card</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ending in •••• 8842</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-morphism-dark p-8 space-y-8 sticky top-32">
                            <h3 className="text-xl font-black uppercase tracking-tighter pb-4 border-b border-white/5">Neural Summary</h3>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded overflow-hidden bg-white/5">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white uppercase tracking-tighter line-clamp-1">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 font-black">HEX-{item.id.slice(-4)} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-white">${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5 uppercase tracking-widest font-black text-[10px] text-gray-500">
                                <div className="flex justify-between">
                                    <span>Subtotal Sequence</span>
                                    <span className="text-white">${cartTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Neural Logistics</span>
                                    <span className="text-white">$25</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-white/5 text-lg text-white">
                                    <span className="tracking-tighter">Grand Total</span>
                                    <span className="text-gradient">${cartTotal + 25}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full btn-primary py-5 text-base uppercase font-black tracking-[0.2em] relative overflow-hidden group"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Encrypting...</span>
                                    </div>
                                ) : (
                                    <span>Execute Payment</span>
                                )}
                            </button>

                            <div className="flex items-center justify-center space-x-2 text-[8px] text-gray-600 font-black tracking-widest uppercase">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                <span>End-to-End Quantum Encryption Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
