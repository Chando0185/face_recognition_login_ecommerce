import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'MacBook Pro M3',
        description: 'The most advanced laptop for professional workflows with the M3 chip.',
        price: 1999,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        stock: 12
    },
    {
        id: '2',
        name: 'Sony A7 IV',
        description: 'A versatile full-frame mirrorless camera for photography and cinema.',
        price: 2499,
        category: 'Cameras',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        stock: 8
    },
    {
        id: '3',
        name: 'Keychron Q1 Pro',
        description: 'Fully customizable wireless mechanical keyboard with aluminum body.',
        price: 199,
        category: 'Keyboards',
        image: 'https://images.unsplash.com/photo-1595225405013-98993544f85c?auto=format&fit=crop&q=80&w=800',
        stock: 25
    },
    {
        id: '4',
        name: 'Logitech MX Master 3S',
        description: 'The ultimate performance mouse for creators and developers.',
        price: 99,
        category: 'Mouse',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
        stock: 30
    },
    {
        id: '5',
        name: 'AirPods Max',
        description: 'High-fidelity audio with industry-leading active noise cancellation.',
        price: 549,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426ff4731?auto=format&fit=crop&q=80&w=800',
        stock: 15
    },
    {
        id: '6',
        name: 'ASUS ROG Swift OLED',
        description: 'Ultrafast 240Hz gaming monitor with stunning OLED depth.',
        price: 1299,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
        stock: 5
    },
    {
        id: '7',
        name: 'iPad Pro M2',
        description: 'The ultimate tablet experience with desktop-class performance.',
        price: 1099,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
        stock: 10
    },
    {
        id: '8',
        name: 'Razer DeathAdder V3',
        description: 'Ultra-lightweight ergonomic wired gaming mouse.',
        price: 69,
        category: 'Mouse',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
        stock: 50
    },
    {
        id: '9',
        name: 'Canon EOS R5',
        description: 'Pro fessional image quality with 8K RAW video capabilities.',
        price: 3499,
        category: 'Cameras',
        image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800',
        stock: 3
    },
    {
        id: '10',
        name: 'SteelSeries Apex Pro',
        description: 'The worlds fastest mechanical gaming keyboard.',
        price: 199,
        category: 'Keyboards',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
        stock: 12
    },
    {
        id: '11',
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones.',
        price: 399,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        stock: 20
    },
    {
        id: '12',
        name: 'Dell XPS 15',
        description: 'The perfect balance of power and portability for creators.',
        price: 2199,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
        stock: 7
    },
    {
        id: '13',
        name: 'GoPro HERO12 Black',
        description: 'Capture incredible video with 5.3K HDR resolution.',
        price: 399,
        category: 'Cameras',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800',
        stock: 15
    },
    {
        id: '14',
        name: 'Glorious Model O 2',
        description: 'A masterpiece of design and performance gaming mouse.',
        price: 89,
        category: 'Mouse',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
        stock: 25
    },
    {
        id: '15',
        name: 'Ducky One 3 TKL',
        description: 'High-quality PBT keycaps and hot-swappable switches.',
        price: 129,
        category: 'Keyboards',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
        stock: 10
    }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(() =>
        getStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
    );

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.PRODUCTS, products);
    }, [products]);

    const addProduct = (product: Product) => setProducts([...products, product]);

    const updateProduct = (updatedProduct: Product) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, categories }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
