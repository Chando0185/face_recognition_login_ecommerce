import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { ChevronRight, Zap, Target, Award, ArrowRight, Search, X } from 'lucide-react';

const Home: React.FC = () => {
    const { products, categories } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Units');
    const titleRef = useRef<HTMLHeadingElement>(null);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Units' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        const handleHashScroll = () => {
            if (window.location.hash === '#products') {
                const element = document.getElementById('products');
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        };

        handleHashScroll();
        window.addEventListener('hashchange', handleHashScroll);

        const ctx = gsap.context(() => {
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: 0.2
                });
            }

            gsap.from('.hero-content-item', {
                opacity: 0,
                y: 40,
                stagger: 0.2,
                duration: 1,
                delay: 0.6,
                ease: 'expo.out'
            });

            gsap.from('.hero-card', {
                opacity: 0,
                scale: 0.8,
                stagger: 0.15,
                duration: 1,
                delay: 1,
                ease: 'back.out(1.7)'
            });
        });

        return () => {
            window.removeEventListener('hashchange', handleHashScroll);
            ctx.revert();
        };
    }, []);

    return (
        <div className="bg-dark min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[140px] opacity-40"></div>
                    <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-30"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00d2ff]"></span>
                            <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-gray-300">Quantum Commerce Protocol 1.0</span>
                        </motion.div>

                        <div className="mb-8 overflow-visible">
                            <h1 ref={titleRef} className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white mb-4">
                                Future <span className="text-gradient">Tech</span> <br />
                                <span className="flex items-center justify-center">
                                    Unleashed
                                </span>
                            </h1>
                        </div>

                        <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-xl mb-12 hero-content-item leading-relaxed">
                            Welcome to the elite hardware exchange. Secured by decentralized biometrics and
                            powered by next-gen neural rendering. Explore the ultimate curated tech ecosystem.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 hero-content-item">
                            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary py-5 px-12 text-lg flex items-center space-x-3 group relative overflow-hidden">
                                <span className="relative z-10">Explore Catalog</span>
                                <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button className="px-12 py-5 glass-morphism text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all border-white/10">
                                Genesis NFT
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
                            {[
                                { icon: Zap, title: "Instant Access", desc: "Biometric auth sequence" },
                                { icon: Target, title: "Curated Elite", desc: "Tier-1 Hardware only" },
                                { icon: Award, title: "Smart Warranty", desc: "Blockchain verified" }
                            ].map((item, i) => (
                                <div key={i} className="hero-card glass-morphism-dark p-6 flex flex-col items-center text-center space-y-4 group hover:border-primary/40 transition-colors">
                                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white uppercase tracking-tighter text-lg">{item.title}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section id="products" className="container mx-auto px-6 py-32 bg-dark">
                <div className="flex flex-col space-y-8 mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between space-y-6 lg:space-y-0">
                        <div className="max-w-2xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-[2px] bg-primary"></div>
                                <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Marketplace</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">Neural <span className="text-gradient">Hardware</span></h2>
                            <p className="text-gray-400 mt-4 text-lg">Acquire the instruments of creation. Filter by neural compatibility.</p>
                        </div>

                        <div className="w-full lg:w-96 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search hardware index..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold uppercase tracking-widest"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500 hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                        {['All Units', ...categories].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 glass-morphism text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest whitespace-nowrap border ${selectedCategory === cat ? 'border-primary/50 text-primary bg-primary/5' : 'border-white/10 text-gray-400'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                            <Search className="w-10 h-10 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">No Neural Matches</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto font-medium">The specified sequence does not exist in our current hardware index.</p>
                        </div>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All Units'); }}
                            className="text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
                        >
                            Reset Global Search
                        </button>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-20 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center font-black">S</div>
                        <span className="text-xl font-black tracking-tighter">SMART<span className="text-primary">TECH</span></span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 font-medium">
                        The future of commerce is decentralized, biometric, and ultra-fast.
                    </p>
                    <div className="flex justify-center space-x-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-colors">Protocol</a>
                        <a href="#" className="hover:text-primary transition-colors">Neural</a>
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                    </div>
                    <p className="mt-12 text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
                        © 2026 SMART TECH SYSTEM. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
