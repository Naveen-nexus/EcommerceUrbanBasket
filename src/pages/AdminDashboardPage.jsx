import { useState } from 'react';
import { products as initialProducts, sampleOrders } from '../utils/data';
import { formatPrice } from '../utils/helpers';

/**
 * AdminDashboardPage — Admin-only page for managing products and orders.
 * Features: product CRUD table, add/edit product form, order management table.
 */
export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('products');
    const [productList, setProductList] = useState(initialProducts);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form state for add/edit product
    const emptyForm = { title: '', price: '', originalPrice: '', category: '', description: '', stock: '', rating: '4.5' };
    const [formData, setFormData] = useState(emptyForm);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /** Open the form for adding a new product */
    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    /** Open the form with existing product data for editing */
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category,
            description: product.description,
            stock: product.stock.toString(),
            rating: product.rating.toString(),
        });
        setShowForm(true);
    };

    /** Save the product (add or update) */
    const handleSave = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
            stock: parseInt(formData.stock),
            rating: parseFloat(formData.rating),
            reviewCount: editingProduct?.reviewCount || 0,
            images: editingProduct?.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
        };

        if (editingProduct) {
            // Update existing product
            setProductList((prev) =>
                prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
            );
        } else {
            // Add new product
            const newId = Math.max(...productList.map((p) => p.id)) + 1;
            setProductList((prev) => [{ ...productData, id: newId }, ...prev]);
        }

        setShowForm(false);
        setEditingProduct(null);
        setFormData(emptyForm);
    };

    /** Delete a product by ID */
    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProductList((prev) => prev.filter((p) => p.id !== productId));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-amber-100 text-amber-700';
            case 'Pending': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Dashboard header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your products and orders</p>
                </div>
                {activeTab === 'products' && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 self-start rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </button>
                )}
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    { label: 'Total Products', value: productList.length, icon: '📦', color: 'bg-primary-50 text-primary-700' },
                    { label: 'Total Orders', value: sampleOrders.length, icon: '🛍️', color: 'bg-green-50 text-green-700' },
                    { label: 'Revenue', value: formatPrice(sampleOrders.reduce((s, o) => s + o.total, 0)), icon: '💰', color: 'bg-amber-50 text-amber-700' },
                    { label: 'Low Stock', value: productList.filter((p) => p.stock < 30).length, icon: '⚠️', color: 'bg-red-50 text-red-700' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="mt-2 text-2xl font-extrabold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-6">
                {[
                    { id: 'products', label: '📦 Products' },
                    { id: 'orders', label: '🛍️ Orders' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Add/Edit Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Product Title</label>
                                <input
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                    placeholder="Product name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="99.99"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Original Price ($)</label>
                                    <input
                                        name="originalPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.originalPrice}
                                        onChange={handleFormChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="129.99"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                                    >
                                        <option value="">Select category</option>
                                        {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Groceries'].map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Stock</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={handleFormChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none resize-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                    placeholder="Product description..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
                                >
                                    {editingProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80">
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Rating</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productList.map((product) => (
                                    <tr key={product.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    <img src={product.images?.[0]} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{product.category}</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${product.stock > 50 ? 'bg-green-100 text-green-700' :
                                                    product.stock > 20 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">⭐ {product.rating}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                                                    title="Edit"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80">
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Items</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sampleOrders.map((order) => (
                                    <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{order.items.length} item(s)</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatPrice(order.total)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
