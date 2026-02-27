import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

/**
 * CartPage — Displays cart items with quantity controls, subtotal, and checkout link.
 */
export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 animate-fade-in">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl">
                    🛒
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-2 text-gray-500 max-w-md">
                    Looks like you haven't added anything to your cart yet. Start exploring our products!
                </p>
                <Link
                    to="/products"
                    className="mt-8 rounded-full bg-primary-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    Shopping Cart
                    <span className="ml-2 text-lg font-medium text-gray-400">
                        ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
                    </span>
                </h1>
                <button
                    onClick={clearCart}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart items list */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md sm:gap-6 sm:p-6"
                        >
                            {/* Product image */}
                            <Link to={`/product/${item.id}`} className="shrink-0">
                                <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32">
                                    <img
                                        src={item.images?.[0]}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </Link>

                            {/* Item details */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 sm:text-base">
                                        {item.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-gray-400">{item.category}</p>
                                </div>

                                <div className="mt-3 flex items-end justify-between">
                                    {/* Quantity controls */}
                                    <div className="flex items-center rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg transition-colors"
                                        >
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg transition-colors"
                                        >
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Price */}
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            title="Remove item"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6">
                        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium text-green-600">
                                    {cartTotal >= 50 ? 'Free' : formatPrice(9.99)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax (est.)</span>
                                <span className="font-medium text-gray-900">{formatPrice(cartTotal * 0.08)}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-xl font-extrabold text-gray-900">
                                    {formatPrice(cartTotal + (cartTotal >= 50 ? 0 : 9.99) + cartTotal * 0.08)}
                                </span>
                            </div>
                        </div>

                        {cartTotal < 50 && (
                            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                Add {formatPrice(50 - cartTotal)} more for free shipping!
                            </p>
                        )}

                        <Link
                            to={user ? '/checkout' : '/login'}
                            className="mt-6 block w-full rounded-xl bg-primary-600 py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200"
                        >
                            {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                        </Link>

                        <Link
                            to="/products"
                            className="mt-3 block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
