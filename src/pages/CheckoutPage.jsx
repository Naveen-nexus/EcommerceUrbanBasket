import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

/**
 * CheckoutPage — Shipping address form + order summary.
 * Frontend-only placeholder (no actual payment processing).
 */
export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate order processing
        await new Promise((r) => setTimeout(r, 1500));

        setOrderPlaced(true);
        clearCart();
        setLoading(false);
    };

    // Order confirmation screen
    if (orderPlaced) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 animate-scale-in">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
                    ✅
                </div>
                <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Placed!</h1>
                <p className="mt-3 text-gray-500 max-w-md">
                    Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                    Order #ORD-{Date.now().toString().slice(-6)}
                </p>
                <div className="mt-8 flex gap-4">
                    <Link
                        to="/account"
                        className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
                    >
                        View Orders
                    </Link>
                    <Link
                        to="/products"
                        className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="text-5xl mb-4">🛒</div>
                <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-2 text-gray-500">Add items to your cart before checking out.</p>
                <Link to="/products" className="mt-6 rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700">
                    Browse Products
                </Link>
            </div>
        );
    }

    const shipping = cartTotal >= 50 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + shipping + tax;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl mb-8">Checkout</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Shipping form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Information</h2>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                                    <input
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700">Street Address</label>
                                    <input
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">City</label>
                                    <input
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">State</label>
                                        <input
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">ZIP</label>
                                        <input
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                            {/* Items list */}
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                                            <img src={item.images?.[0]} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4 border-gray-100" />

                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium text-green-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-medium">{formatPrice(tax)}</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-extrabold text-gray-900">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Place order button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Place Order · ${formatPrice(total)}`
                                )}
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-400">
                                🔒 Your payment information is secure
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
