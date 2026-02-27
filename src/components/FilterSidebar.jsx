import { categories } from '../utils/data';

/**
 * FilterSidebar — Product filtering controls.
 * Allows filtering by category, price range, and minimum rating.
 */
export default function FilterSidebar({ filters, onFilterChange, className = '' }) {
    const priceRanges = [
        { label: 'Under $25', min: 0, max: 25 },
        { label: '$25 – $50', min: 25, max: 50 },
        { label: '$50 – $100', min: 50, max: 100 },
        { label: '$100 – $200', min: 100, max: 200 },
        { label: 'Over $200', min: 200, max: Infinity },
    ];

    const ratings = [4, 3, 2, 1];

    return (
        <aside className={`space-y-6 ${className}`}>
            {/* Category filter */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Category</h3>
                <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                        <input
                            type="radio"
                            name="category"
                            checked={!filters.category}
                            onChange={() => onFilterChange({ ...filters, category: '' })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="category"
                                checked={filters.category === cat.name}
                                onChange={() => onFilterChange({ ...filters, category: cat.name })}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{cat.icon} {cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price range filter */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Price Range</h3>
                <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                        <input
                            type="radio"
                            name="price"
                            checked={!filters.priceRange}
                            onChange={() => onFilterChange({ ...filters, priceRange: null })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Any Price</span>
                    </label>
                    {priceRanges.map((range) => (
                        <label
                            key={range.label}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="price"
                                checked={filters.priceRange?.label === range.label}
                                onChange={() => onFilterChange({ ...filters, priceRange: range })}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating filter */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Rating</h3>
                <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50">
                        <input
                            type="radio"
                            name="rating"
                            checked={!filters.minRating}
                            onChange={() => onFilterChange({ ...filters, minRating: 0 })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">All Ratings</span>
                    </label>
                    {ratings.map((rating) => (
                        <label
                            key={rating}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === rating}
                                onChange={() => onFilterChange({ ...filters, minRating: rating })}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-1 text-xs text-gray-500">& Up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear filters */}
            <button
                onClick={() => onFilterChange({ category: '', priceRange: null, minRating: 0 })}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
            >
                Clear All Filters
            </button>
        </aside>
    );
}
