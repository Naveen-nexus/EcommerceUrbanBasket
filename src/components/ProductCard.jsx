import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getDiscount, getStarArray, truncate } from '../utils/helpers';

/**
 * ProductCard — Reusable product card for grid layouts.
 * Shows image, badge, title, price, rating, and quick add-to-cart.
 */
export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const discount = getDiscount(product.originalPrice, product.price);
    const stars = getStarArray(product.rating);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation when clicking inside the Link
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link
            to={`/product/${product.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
        >
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Badge */}
                {product.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                        {product.badge}
                    </span>
                )}
                {/* Discount tag */}
                {discount > 0 && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                        -{discount}%
                    </span>
                )}
                {/* Quick add button (visible on hover) */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-primary-600 hover:text-white"
                    title="Add to cart"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Card content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Category */}
                <span className="text-[11px] font-medium uppercase tracking-wider text-primary-600">
                    {product.category}
                </span>

                {/* Title */}
                <h3 className="mt-1.5 text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                    {truncate(product.title, 50)}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                        {stars.map((star, i) => (
                            <svg
                                key={i}
                                className={`h-3.5 w-3.5 ${star === 'full' ? 'text-amber-400' : star === 'half' ? 'text-amber-300' : 'text-gray-200'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">
                        ({product.reviewCount?.toLocaleString()})
                    </span>
                </div>

                {/* Price */}
                <div className="mt-auto pt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
