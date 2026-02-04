import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, type Product } from '../contexts/ProductContext';
import { Plus, Edit2, Trash2, LayoutDashboard, ShoppingBag, Users, Search, X, Shield, Package, Clock, DollarSign, CheckCircle2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';

const AdminDashboard: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, categories } = useProducts();
    const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'users'>('inventory');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [userOrderFilter, setUserOrderFilter] = useState<{ id: string, name: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
    });

    useEffect(() => {
        if (activeTab === 'orders') {
            const storedOrders = getStorageItem<any[]>(STORAGE_KEYS.ORDERS, []);
            setOrders(storedOrders);
        } else if (activeTab === 'users') {
            const storedUsers = getStorageItem<any[]>(STORAGE_KEYS.USERS, []);
            setUsers(storedUsers);
        }
    }, [activeTab]);

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
        const allOrders = getStorageItem<any[]>(STORAGE_KEYS.ORDERS, []);
        const updatedOrders = allOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setStorageItem(STORAGE_KEYS.ORDERS, updatedOrders);
        setOrders(updatedOrders);

        if (selectedOrderDetails?.id === orderId) {
            setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
        }

        // Console log for neural verification
        console.log(`[Order Manager] Status Update: ${orderId} -> ${newStatus}`);
    };

    const handleViewUserOrders = (userId: string, userName: string) => {
        setUserOrderFilter({ id: userId, name: userName });
        setActiveTab('orders');
    };

    const filteredOrders = orders.filter(order => {
        if (userOrderFilter) {
            return order.userId === userOrderFilter.id;
        }
        return true;
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                image: product.image,
                stock: product.stock.toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: categories[0] || 'Laptops',
                image: '',
                stock: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData: Product = {
            id: editingProduct ? editingProduct.id : Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
            stock: parseInt(formData.stock)
        };

        if (editingProduct) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-32 pb-20 container mx-auto px-6">
            <Navbar />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-4">
                    <div className="glass-morphism p-6 space-y-2">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Operations</h3>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-primary/20 text-primary font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Inventory</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-primary/20 text-primary font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary/20 text-primary font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Users</span>
                        </button>
                    </div>

                    <div className="glass-morphism p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white uppercase text-xs tracking-widest">Admin Authorization</h4>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Status: Level 5 Clear</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-8">
                    {activeTab === 'inventory' ? (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory <span className="text-secondary">Control</span></h1>
                                    <p className="text-gray-400 text-sm">Manage products and stock availability</p>
                                </div>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="btn-primary py-3 px-8 flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Product</span>
                                </button>
                            </div>

                            <div className="glass-morphism overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center px-6">
                                    <Search className="w-5 h-5 text-gray-500 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Search inventory..."
                                        className="bg-transparent border-none focus:outline-none text-sm w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 text-xs font-black text-gray-500 uppercase tracking-widest">
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Stock</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredProducts.map(product => (
                                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={product.image}
                                                                className="w-10 h-10 rounded object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';
                                                                }}
                                                            />
                                                            <span className="font-bold text-sm text-white">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-gray-400 bg-white/10 px-2 py-1 rounded">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-primary">${product.price}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                            <span className="text-sm text-white font-medium">{product.stock} units</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleOpenModal(product)}
                                                                className="p-2 hover:bg-white/10 rounded transition-colors text-blue-400"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product.id)}
                                                                className="p-2 hover:bg-white/10 rounded transition-colors text-red-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : activeTab === 'orders' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">Order <span className="text-primary">Sequences</span></h1>
                                <p className="text-gray-400 text-sm">Real-time purchase streams and logistics status</p>
                            </div>

                            {userOrderFilter && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center space-x-4 bg-primary/10 border border-primary/20 p-4 rounded-xl"
                                >
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Personnel Locked-on</p>
                                        <p className="text-sm font-bold text-white uppercase">{userOrderFilter.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setUserOrderFilter(null)}
                                        className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-morphism p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Total Volume</p>
                                        <p className="text-2xl font-black text-white">{filteredOrders.length}</p>
                                    </div>
                                </div>
                                <div className="glass-morphism p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><DollarSign className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Gross Revenue</p>
                                        <p className="text-2xl font-black text-white">${filteredOrders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="glass-morphism p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle2 className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Active Nodes</p>
                                        <p className="text-2xl font-black text-white">{new Set(filteredOrders.map(o => o.userId)).size}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-morphism overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 text-xs font-black text-gray-500 uppercase tracking-widest">
                                                <th className="px-6 py-4">ID / Pulse</th>
                                                <th className="px-6 py-4">Client Persona</th>
                                                <th className="px-6 py-4">Timestamp</th>
                                                <th className="px-6 py-4">Total Value</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => { setSelectedOrderDetails(order); setIsOrderDetailsModalOpen(true); }}
                                                                className="p-1.5 hover:bg-primary/20 rounded text-primary transition-colors"
                                                                title="Inspect Payload"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                            </button>
                                                            <span className="font-mono text-xs text-primary font-bold">#{order.id.split('-')[1]}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm text-white">{order.userName || 'Anonymous Host'}</span>
                                                            <span className="text-[10px] text-gray-500 font-medium">UID: {order.userId?.slice(-6)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{new Date(order.timestamp).toLocaleString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-white">${order.total}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-between group-hover:justify-start group-hover:space-x-4">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${order.status === 'Processing' ? 'border-primary/50 text-primary bg-primary/5' :
                                                                order.status === 'Accepted' ? 'border-green-500/50 text-green-500 bg-green-500/5' :
                                                                    'border-red-500/50 text-red-500 bg-red-500/5'
                                                                }`}>
                                                                {order.status}
                                                            </span>

                                                            {order.status === 'Processing' && (
                                                                <div className="hidden group-hover:flex items-center space-x-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                                    <button
                                                                        onClick={() => handleUpdateOrderStatus(order.id, 'Accepted')}
                                                                        className="px-3 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20 text-[8px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all font-sans"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateOrderStatus(order.id, 'Rejected')}
                                                                        className="px-3 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/20 text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all font-sans"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center space-y-4">
                                                            <Package className="w-12 h-12 text-gray-700" />
                                                            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">No transaction pulses detected</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">Personnel <span className="text-secondary">Databank</span></h1>
                                <p className="text-gray-400 text-sm">Authorized identities and biometric enrollment records</p>
                            </div>

                            <div className="glass-morphism overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 text-xs font-black text-gray-500 uppercase tracking-widest">
                                                <th className="px-6 py-4">Identity</th>
                                                <th className="px-6 py-4">Email Terminal</th>
                                                <th className="px-6 py-4">Security Level</th>
                                                <th className="px-6 py-4">Biometrics</th>
                                                <th className="px-6 py-4 text-right">ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map(user => (
                                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                                                                <Users className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-bold text-sm text-white">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-400 text-xs">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${user.isAdmin ? 'border-secondary/50 text-secondary bg-secondary/5' : 'border-white/10 text-gray-500 bg-white/5'
                                                            }`}>
                                                            {user.isAdmin ? 'Admin Clearance' : 'Guest Access'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`w-2 h-2 rounded-full ${user.faceDescriptor ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-gray-700'}`}></span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${user.faceDescriptor ? 'text-green-500' : 'text-gray-600'}`}>
                                                                {user.faceDescriptor ? 'Enrolled' : 'Offline'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleViewUserOrders(user.id, user.name)}
                                                            className="p-2 hover:bg-white/10 rounded transition-colors text-primary flex items-center space-x-2 ml-auto"
                                                            title="View User History"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest hidden group-hover:block">View History</span>
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[10px] font-mono text-gray-600">
                                                        #{user.id?.slice(-6)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-700 font-black uppercase tracking-[0.3em] text-[10px]">
                                                        No personnel records detected in core memory
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl glass-morphism-dark overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-black uppercase text-gradient">
                                    {editingProduct ? 'Update Inventory' : 'Add New Unit'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hardware Persona</label>
                                    <input
                                        className="input-field py-3.5"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Elite Unit 01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Value ($)</label>
                                    <input
                                        type="number"
                                        className="input-field py-3.5"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Available Units</label>
                                    <input
                                        type="number"
                                        className="input-field py-3.5"
                                        required
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Logistics Tier</label>
                                    <select
                                        className="input-field bg-dark py-3.5 appearance-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {['Laptops', 'Cameras', 'Keyboards', 'Mouse', 'Accessories'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Visual Asset URL</label>
                                    <input
                                        className="input-field py-3.5"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Metadata Description</label>
                                    <textarea
                                        className="input-field min-h-[100px] py-3.5"
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Technical specifications and capabilities..."
                                    />
                                </div>
                                <div className="col-span-2 pt-4">
                                    <button type="submit" className="w-full btn-primary py-4 uppercase font-black text-lg shadow-[0_0_30px_rgba(0,210,255,0.3)]">
                                        {editingProduct ? 'Execute Binary Update' : 'Initialize Unit Sequence'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {isOrderDetailsModalOpen && selectedOrderDetails && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOrderDetailsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-morphism-dark w-full max-w-2xl relative z-10 p-8 border-white/10"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Order <span className="text-primary">Payload</span></h2>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Sequence ID: #{selectedOrderDetails.id.split('-')[1]}</p>
                                </div>
                                <button
                                    onClick={() => setIsOrderDetailsModalOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Client Identity</p>
                                        <p className="text-sm font-bold text-white">{selectedOrderDetails.userName}</p>
                                        <p className="text-[10px] text-gray-500">UID: {selectedOrderDetails.userId?.slice(-10)}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Shipping Coordinates</p>
                                        <p className="text-xs text-gray-300 font-medium leading-relaxed">{selectedOrderDetails.address}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Neural Timestamp</p>
                                        <p className="text-xs text-white font-bold">{new Date(selectedOrderDetails.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status Protocol</p>
                                        <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedOrderDetails.status === 'Processing' ? 'border-primary/50 text-primary bg-primary/5' :
                                            selectedOrderDetails.status === 'Accepted' ? 'border-green-500/50 text-green-500 bg-green-500/5' :
                                                'border-red-500/50 text-red-500 bg-red-500/5'
                                            }`}>
                                            {selectedOrderDetails.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-morphism overflow-hidden mb-8 max-h-[300px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 sticky top-0">
                                        <tr className="border-b border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest font-sans">
                                            <th className="px-4 py-3">Asset</th>
                                            <th className="px-4 py-3 text-center">Qty</th>
                                            <th className="px-4 py-3 text-right">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-sans">
                                        {selectedOrderDetails.items.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/5">
                                                <td className="px-4 py-3 flex items-center space-x-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';
                                                        }}
                                                    />
                                                    <span className="text-[10px] font-bold text-white uppercase">{item.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-[10px] font-black text-gray-400">×{item.quantity}</td>
                                                <td className="px-4 py-3 text-right text-[10px] font-black text-white">${(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Transaction Value</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">${selectedOrderDetails.total.toLocaleString()}</p>
                                </div>
                                <div className="flex space-x-4">
                                    {selectedOrderDetails.status === 'Processing' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Rejected')}
                                                className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all font-sans"
                                            >
                                                Reject Payload
                                            </button>
                                            <button
                                                onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Accepted')}
                                                className="px-6 py-3 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 text-xs font-black uppercase tracking-widest hover:bg-green-500/20 transition-all font-sans"
                                            >
                                                Accept Payload
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
