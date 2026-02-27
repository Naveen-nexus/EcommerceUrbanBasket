import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { products } from '../utils/data';
import { sleep } from '../utils/helpers';

const ITEMS_PER_PAGE = 8;

/**
 * ProductListingPage — Displays all products with filters, search, sorting, and pagination.
 */
export default function ProductListingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Read initial filter values from URL params
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        priceRange: null,
        minRating: 0,
    });
    const [sortBy, setSortBy] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        sleep(500).then(() => setLoading(false));
    }, []);

    // Reset to page 1 when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy, searchQuery]);

    // Sync category from URL params
    useEffect(() => {
        const urlCategory = searchParams.get('category') || '';
        if (urlCategory !== filters.category) {
            setFilters((prev) => ({ ...prev, category: urlCategory }));
        }
    }, [searchParams]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (filters.category) {
            result = result.filter((p) => p.category === filters.category);
        }

        // Price range filter
        if (filters.priceRange) {
            result = result.filter(
                (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
            );
        }

        // Rating filter
        if (filters.minRating) {
            result = result.filter((p) => p.rating >= filters.minRating);
        }

        // Sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                // Featured first, then by id
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        return result;
    }, [filters, sortBy, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        // Update URL params for category
        const params = new URLSearchParams(searchParams);
        if (newFilters.category) {
            params.set('category', newFilters.category);
        } else {
            params.delete('category');
        }
        setSearchParams(params);
    };

    if (loading) return <Loader text="Loading products..." />;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                        {searchQuery ? `Results for "${searchQuery}"` : filters.category || 'All Products'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </button>

                    {/* Sort dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Main content */}
            <div className="mt-8 flex gap-8">
                {/* Sidebar — desktop */}
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    className="hidden w-64 shrink-0 lg:block"
                />

                {/* Mobile filters overlay */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-surface p-6 shadow-2xl animate-slide-down">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <FilterSidebar filters={filters} onFilterChange={(f) => { handleFilterChange(f); setMobileFiltersOpen(false); }} />
                        </div>
                    </div>
                )}

                {/* Product grid */}
                <div className="flex-1">
                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                                🔍
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">No products found</h3>
                            <p className="mt-2 text-sm text-gray-500 max-w-sm">
                                Try adjusting your filters or search terms to find what you're looking for.
                            </p>
                            <button
                                onClick={() => handleFilterChange({ category: '', priceRange: null, minRating: 0 })}
                                className="mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
