import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { products } from '../utils/data';
import { formatPrice, getDiscount, getStarArray, sleep } from '../utils/helpers';

/**
 * ProductDetailsPage — Full product view with image gallery,
 * info, add-to-cart, and related products.
 */
export default function ProductDetailsPage() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const product = products.find((p) => p.id === parseInt(id));

    // Related products: same category, excluding current
    const relatedProducts = products
        .filter((p) => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4);

    useEffect(() => {
        setLoading(true);
        setSelectedImage(0);
        setQuantity(1);
        setAddedToCart(false);
        sleep(400).then(() => setLoading(false));
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <Loader text="Loading product..." />;

    if (!product) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
                <p className="mt-2 text-gray-500">The product you're looking for doesn't exist.</p>
                <Link to="/products" className="mt-6 rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700">
                    Browse Products
                </Link>
            </div>
        );
    }

    const discount = getDiscount(product.originalPrice, product.price);
    const stars = getStarArray(product.rating);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
                <span>/</span>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 transition-colors">{product.category}</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
            </nav>

            {/* Product main section */}
            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image gallery */}
                <div className="space-y-4">
                    {/* Main image */}
                    <div className="aspect-square overflow-hidden rounded-3xl bg-gray-50 border border-gray-100">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Thumbnail row */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === index
                                            ? 'border-primary-500 shadow-md shadow-primary-200'
                                            : 'border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    <img src={img} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className="flex flex-col">
                    {/* Badge */}
                    {product.badge && (
                        <span className="self-start rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700 uppercase">
                            {product.badge}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl leading-tight">
                        {product.title}
                    </h1>

                    {/* Rating and reviews */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex gap-0.5">
                            {stars.map((star, i) => (
                                <svg
                                    key={i}
                                    className={`h-5 w-5 ${star === 'full' ? 'text-amber-400' : star === 'half' ? 'text-amber-300' : 'text-gray-200'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                        <span className="text-sm text-gray-400">({product.reviewCount?.toLocaleString()} reviews)</span>
                    </div>

                    {/* Price section */}
                    <div className="mt-6 flex items-baseline gap-3">
                        <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                            <>
                                <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                    Save {discount}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="mt-6 text-sm leading-relaxed text-gray-600">
                        {product.description}
                    </p>

                    {/* Stock status */}
                    <div className="mt-6">
                        {product.stock > 0 ? (
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-green-700">
                                    In Stock ({product.stock} available)
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                <span className="text-sm font-medium text-red-600">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Quantity + Add to Cart */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Quantity selector */}
                        <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="flex h-12 w-12 items-center justify-center text-gray-500 transition-colors hover:text-gray-700 hover:bg-gray-50 rounded-l-xl"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="flex h-12 w-14 items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                className="flex h-12 w-12 items-center justify-center text-gray-500 transition-colors hover:text-gray-700 hover:bg-gray-50 rounded-r-xl"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Add to cart button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`flex-1 rounded-xl py-3.5 text-sm font-bold transition-all ${addedToCart
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                        </button>
                    </div>

                    {/* Features strip */}
                    <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                        {[
                            { icon: '🚚', label: 'Free Shipping' },
                            { icon: '↩️', label: '30-Day Returns' },
                            { icon: '🔒', label: 'Secure Payment' },
                        ].map((feat) => (
                            <div key={feat.label} className="text-center">
                                <div className="text-xl">{feat.icon}</div>
                                <div className="mt-1 text-[11px] font-medium text-gray-500">{feat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-16 border-t border-gray-100 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900">Related Products</h2>
                        <Link
                            to={`/products?category=${encodeURIComponent(product.category)}`}
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
