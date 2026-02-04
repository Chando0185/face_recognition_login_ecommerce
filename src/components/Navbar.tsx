import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartSidebar from './CartSidebar';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
            <div className="max-w-7xl mx-auto glass-morphism px-6 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">SMART<span className="text-primary">TECH</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
                    <a href="/#products" className="text-sm font-medium hover:text-primary transition-colors">Products</a>
                    {isAuthenticated && user?.isAdmin && (
                        <Link to="/admin" className="text-sm font-medium text-secondary hover:text-secondary-dark flex items-center">
                            <Shield className="w-4 h-4 mr-1" /> Admin
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-dark">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <User className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user?.name}</span>
                                </Link>
                                {user?.isAdmin && (
                                    <Link to="/admin" className="p-2.5 bg-white/5 rounded-xl text-primary hover:bg-primary/20 transition-all border border-white/5">
                                        <Shield className="w-5 h-5" />
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 bg-white/5 rounded-xl text-red-400 hover:bg-red-500/20 transition-all border border-white/5"
                                    title="Terminate Session"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-primary py-2.5 px-6 text-[10px]">
                                Authorize Access
                            </Link>
                        )}
                    </div>

                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Cart Sidebar */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-20 left-4 right-4 glass-morphism-dark p-6 mt-2 flex flex-col space-y-4"
                    >
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <a href="/#products" onClick={() => setIsMenuOpen(false)}>Products</a>
                        {isAuthenticated && user?.isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
