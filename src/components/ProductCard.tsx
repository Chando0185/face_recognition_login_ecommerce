import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../contexts/ProductContext';
import { ShoppingCart, Star, Box } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-morphism overflow-hidden group flex flex-col h-full"
        >
            <div className="relative aspect-square overflow-hidden bg-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';
                    }}
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {product.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full btn-primary py-2 flex items-center justify-center space-x-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold ml-1">4.9</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-white">${product.price}</span>
                    <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase">
                        <Box className="w-3 h-3 mr-1" />
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
