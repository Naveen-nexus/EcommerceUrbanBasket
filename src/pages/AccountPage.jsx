import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sampleOrders } from '../utils/data';
import { formatPrice } from '../utils/helpers';

/**
 * AccountPage — User profile info, order history, and logout.
 * Protected route — only accessible when logged in.
 */
export default function AccountPage() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile({ name: profileData.name });
        setEditMode(false);
    };

    const tabs = [
        { id: 'orders', label: 'Order History', icon: '📦' },
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

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
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-bold text-primary-700">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">{user?.name}</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary-700">
                            {user?.role}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 self-start rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Your Orders</h2>
                    {sampleOrders.length > 0 ? (
                        sampleOrders.map((order) => (
                            <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <span className="text-sm font-bold text-gray-900">{order.id}</span>
                                        <span className="ml-3 text-sm text-gray-400">{order.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{item.title} × {item.quantity}</span>
                                            <span className="text-gray-900 font-medium">{formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-4">📦</div>
                            <p className="text-gray-500">No orders yet. Start shopping!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                                <input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    disabled={!editMode}
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none disabled:opacity-60 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    value={profileData.email}
                                    disabled
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none disabled:opacity-60"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Phone</label>
                                <input
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="Not set"
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none disabled:opacity-60 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Address</label>
                                <input
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="Not set"
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none disabled:opacity-60 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                />
                            </div>
                        </div>

                        {editMode && (
                            <button
                                type="submit"
                                className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        )}
                    </form>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 max-w-2xl">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Settings</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                                <p className="text-xs text-gray-500">Receive order updates and promotions</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" defaultChecked className="peer sr-only" />
                                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Add an extra layer of security</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                        <hr className="border-gray-100" />
                        <div>
                            <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
                            <p className="mt-1 text-xs text-gray-500">Permanently delete your account and all data</p>
                            <button className="mt-3 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
