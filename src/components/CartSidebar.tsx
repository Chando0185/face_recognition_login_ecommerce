import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import type { Product } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-lighter border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-primary" />
                                <h2 className="text-xl font-black uppercase tracking-tighter">Shopping Bag</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Your bag is empty</p>
                                        <button
                                            onClick={onClose}
                                            className="text-primary text-[10px] font-black uppercase mt-2 hover:underline"
                                        >
                                            Start Shopping →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <motion.div
                                            layout
                                            key={item.id}
                                            className="flex space-x-4 p-4 glass-morphism border-white/5 group"
                                        >
                                            <img src={item.image} className="w-20 h-20 object-cover rounded-lg bg-white/5" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-white uppercase tracking-tighter truncate pr-2">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-1 text-gray-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-primary font-black mt-1">${item.price}</p>
                                                <div className="flex items-center space-x-3 mt-4">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 border border-white/10 rounded flex items-center justify-center hover:bg-white/5"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 border border-white/10 rounded flex items-center justify-center hover:bg-white/5"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-black/40 border-t border-white/10 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Neural Total</span>
                                    <span className="text-3xl font-black text-white">${cartTotal}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary py-5 text-sm uppercase font-black tracking-[0.2em] flex items-center justify-center space-x-3 group"
                                >
                                    <CreditCard className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    <span>Secure Checkout</span>
                                </button>
                                <p className="text-[8px] text-center text-gray-600 font-black uppercase tracking-widest">
                                    Processed via quantum-encrypted gateway
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
