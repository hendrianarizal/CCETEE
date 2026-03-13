/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product, Variation, Category } from './types';
import { SAMPLE_PRODUCTS } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Stats for dashboard
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalVariations = products.reduce((acc, p) => acc + p.variations.length, 0);
    const totalStock = products.reduce((acc, p) => acc + p.totalStock, 0);
    const lowStockItems = products.filter(p => p.totalStock < 20).length;
    
    return { totalProducts, totalVariations, totalStock, lowStockItems };
  }, [products]);

  const chartData = useMemo(() => {
    return products.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
      stock: p.totalStock,
      fullName: p.name
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.variations.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E5E7EB] z-30 hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">ShopManager</h1>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                activeTab === 'dashboard' ? "bg-black text-white shadow-lg shadow-black/10" : "text-[#6B7280] hover:bg-[#F3F4F6]"
              )}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                activeTab === 'inventory' ? "bg-black text-white shadow-lg shadow-black/10" : "text-[#6B7280] hover:bg-[#F3F4F6]"
              )}
            >
              <Package size={20} />
              <span className="font-medium">Inventory</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">
              {activeTab === 'dashboard' ? 'Overview' : 'Product Inventory'}
            </h2>
            <p className="text-[#6B7280]">Manage your products and their variations efficiently.</p>
          </div>
          
          <button 
            onClick={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#262626] transition-all shadow-lg shadow-black/10"
          >
            <Plus size={20} />
            Add Product
          </button>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon={<Package className="text-blue-600" />} 
                trend="+2 this week"
              />
              <StatCard 
                title="Variations" 
                value={stats.totalVariations} 
                icon={<TrendingUp className="text-emerald-600" />} 
                trend="Active"
              />
              <StatCard 
                title="Total Stock" 
                value={stats.totalStock} 
                icon={<TrendingUp className="text-indigo-600" />} 
                trend="In warehouse"
              />
              <StatCard 
                title="Low Stock Alert" 
                value={stats.lowStockItems} 
                icon={<AlertCircle className="text-rose-600" />} 
                trend="Needs attention"
                warning={stats.lowStockItems > 0}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold mb-6">Stock Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#F9FAFB' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.stock < 20 ? '#F43F5E' : '#111827'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
                <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                        <Package size={18} className="text-[#4B5563]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Stock updated for "Premium T-Shirt"</p>
                        <p className="text-xs text-[#9CA3AF]">2 hours ago • Variation: Blue/L</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 text-sm font-semibold text-[#6B7280] hover:text-black transition-colors flex items-center justify-center gap-2">
                  View All Activity <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products or SKU..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none appearance-none cursor-pointer pr-10 relative"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
                >
                  <option value="All">All Categories</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home">Home</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductRow 
                    key={product.id} 
                    product={product} 
                    onDelete={() => handleDeleteProduct(product.id)}
                    onEdit={() => {
                      setEditingProduct(product);
                      setIsAddModalOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E5E7EB]">
                  <Package size={48} className="mx-auto text-[#D1D5DB] mb-4" />
                  <h3 className="text-lg font-medium text-[#374151]">No products found</h3>
                  <p className="text-[#6B7280]">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <ProductModal 
            product={editingProduct} 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  warning?: boolean;
}

function StatCard({ title, value, icon, trend, warning = false }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm transition-all hover:shadow-md",
      warning && "border-rose-100 bg-rose-50/30"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] flex items-center justify-center">
          {icon}
        </div>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", warning ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>
          {trend}
        </span>
      </div>
      <h4 className="text-[#6B7280] text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

interface ProductRowProps {
  key?: string | number;
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
}

function ProductRow({ product, onDelete, onEdit }: ProductRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
            <img 
              src={product.image || `https://picsum.photos/seed/${product.id}/400/400`} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#111827] truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {product.variations.length} variations
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-medium text-[#111827]">Total Stock</p>
          <p className={cn("text-lg font-bold", product.totalStock < 20 ? "text-rose-600" : "text-[#111827]")}>
            {product.totalStock}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onEdit}
            className="p-2 text-[#6B7280] hover:text-black hover:bg-[#F3F4F6] rounded-lg transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-[#6B7280] hover:text-black hover:bg-[#F3F4F6] rounded-lg transition-all"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#F3F4F6] bg-[#F9FAFB]"
          >
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#9CA3AF] font-medium border-bottom border-[#E5E7EB]">
                      <th className="pb-3 pl-2">Variation</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {product.variations.map((v) => (
                      <tr key={v.id} className="group hover:bg-white/50 transition-colors">
                        <td className="py-3 pl-2 font-medium text-[#374151]">{v.value}</td>
                        <td className="py-3 font-mono text-xs text-[#6B7280]">{v.sku}</td>
                        <td className="py-3 font-semibold text-[#111827]">${v.price}</td>
                        <td className="py-3 font-medium text-[#374151]">{v.stock}</td>
                        <td className="py-3">
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                            v.stock === 0 ? "bg-rose-100 text-rose-600" : 
                            v.stock < 10 ? "bg-amber-100 text-amber-600" : 
                            "bg-emerald-100 text-emerald-600"
                          )}>
                            {v.stock === 0 ? 'Out of Stock' : v.stock < 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}

function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    category: 'Apparel',
    description: '',
    basePrice: 0,
    variations: []
  });

  const addVariation = () => {
    const newVar: Variation = {
      id: Date.now().toString(),
      name: 'Variation',
      value: '',
      sku: '',
      price: formData.basePrice || 0,
      stock: 0
    };
    setFormData({ ...formData, variations: [...(formData.variations || []), newVar] });
  };

  const updateVariation = (id: string, updates: Partial<Variation>) => {
    setFormData({
      ...formData,
      variations: formData.variations?.map(v => v.id === id ? { ...v, ...updates } : v)
    });
  };

  const removeVariation = (id: string) => {
    setFormData({
      ...formData,
      variations: formData.variations?.filter(v => v.id !== id)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalStock = formData.variations?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
    onSave({ ...formData, totalStock } as Product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Product Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Classic Denim Jacket"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Category</label>
                <select 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home">Home</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Base Price ($)</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={formData.basePrice}
                  onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Description</label>
              <textarea 
                rows={7}
                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about the product..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">Variations</h4>
              <button 
                type="button"
                onClick={addVariation}
                className="text-sm font-bold text-black hover:underline flex items-center gap-1"
              >
                <Plus size={16} /> Add Variation
              </button>
            </div>

            <div className="space-y-3">
              {formData.variations?.map((v, idx) => (
                <div key={v.id} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">Value (e.g. Red/XL)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm"
                      value={v.value}
                      onChange={e => updateVariation(v.id, { value: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">SKU</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-mono"
                      value={v.sku}
                      onChange={e => updateVariation(v.id, { sku: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">Price</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm"
                        value={v.price}
                        onChange={e => updateVariation(v.id, { price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">Stock</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm"
                        value={v.stock}
                        onChange={e => updateVariation(v.id, { stock: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => removeVariation(v.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {(!formData.variations || formData.variations.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-[#E5E7EB] rounded-2xl text-[#9CA3AF]">
                  No variations added yet.
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-[#E5E7EB] flex items-center justify-end gap-3 bg-[#F9FAFB]">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-[#4B5563] hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-[#262626] transition-all shadow-lg shadow-black/10"
          >
            Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}
