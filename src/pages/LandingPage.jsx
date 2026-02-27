import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { products, categories } from '../utils/data';
import { sleep } from '../utils/helpers';

/**
 * LandingPage — Homepage with hero banner, featured products,
 * categories, and promotional sections.
 */
export default function LandingPage() {
    const [loading, setLoading] = useState(true);
    const featuredProducts = products.filter((p) => p.featured);

    useEffect(() => {
        // Simulate loading delay
        sleep(600).then(() => setLoading(false));
    }, []);

    if (loading) return <Loader text="Loading ShopVerse..." />;

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
                    <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div className="text-center lg:text-left">
                            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                                ✨ New Collection 2025
                            </span>
                            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                                Discover Your
                                <br />
                                <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                                    Perfect Style
                                </span>
                            </h1>
                            <p className="mt-6 max-w-lg text-lg text-primary-100 mx-auto lg:mx-0">
                                Explore thousands of premium products handpicked for you. From fashion to electronics — find everything you love in one place.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <Link
                                    to="/products"
                                    className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary-700 shadow-xl shadow-primary-900/30 transition-all hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    Shop Now →
                                </Link>
                                <Link
                                    to="/products?category=Fashion"
                                    className="rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
                                >
                                    Browse Fashion
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 flex justify-center gap-10 lg:justify-start">
                                {[
                                    { value: '10K+', label: 'Products' },
                                    { value: '50K+', label: 'Customers' },
                                    { value: '4.9', label: 'Rating' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                                        <div className="text-xs text-primary-200 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero image grid */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=350&fit=crop"
                                        alt="Shopping"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
                                        alt="Fashion"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=250&fit=crop"
                                        alt="Style"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=350&fit=crop"
                                        alt="Products"
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted brands bar */}
            <section className="border-b border-gray-100 bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
                        Trusted by leading brands worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                        {['Nike', 'Samsung', 'Apple', 'Adidas', 'Sony', 'Zara'].map((brand) => (
                            <span key={brand} className="text-xl font-bold text-gray-200 transition-colors hover:text-gray-400">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Browse</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Shop by Category
                        </h2>
                        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                            Find exactly what you're looking for in our curated categories
                        </p>
                    </div>
                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="bg-gray-50/80 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Curated for You</span>
                            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Featured Products
                            </h2>
                            <p className="mt-2 text-gray-500">Handpicked products you'll absolutely love</p>
                        </div>
                        <Link
                            to="/products"
                            className="flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                        >
                            View All Products
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Section */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Promo card 1 */}
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 to-accent-700 p-8 sm:p-12">
                            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
                            <div className="absolute top-8 right-8 h-20 w-20 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase text-white">
                                    Limited Time
                                </span>
                                <h3 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                                    Up to 50% Off
                                </h3>
                                <p className="mt-3 max-w-xs text-accent-100">
                                    Don't miss our seasonal sale on electronics and fashion items.
                                </p>
                                <Link
                                    to="/products"
                                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent-700 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Shop the Sale
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Promo card 2 */}
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12">
                            <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-primary-600/20" />
                            <div className="absolute bottom-6 right-6 h-24 w-24 rounded-full bg-primary-600/10" />
                            <div className="relative z-10">
                                <span className="inline-block rounded-full bg-primary-600/20 px-4 py-1 text-xs font-bold uppercase text-primary-400">
                                    New Arrivals
                                </span>
                                <h3 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                                    Fresh Styles
                                </h3>
                                <p className="mt-3 max-w-xs text-gray-400">
                                    Explore our latest collection. New products added every week.
                                </p>
                                <Link
                                    to="/products"
                                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-500 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Discover More
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Trust section */}
            <section className="border-t border-gray-100 bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
                            { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
                            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
                            { icon: '💬', title: '24/7 Support', desc: 'Dedicated help team' },
                        ].map((feature) => (
                            <div key={feature.title} className="flex items-start gap-4 rounded-2xl p-5 transition-colors hover:bg-gray-50">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-2xl">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{feature.title}</h4>
                                    <p className="mt-1 text-sm text-gray-500">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
