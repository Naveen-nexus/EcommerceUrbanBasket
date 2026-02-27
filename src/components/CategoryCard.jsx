import { Link } from 'react-router-dom';

/**
 * CategoryCard — Displays a category with an icon/image and name.
 * Links to the product listing page filtered by that category.
 */
export default function CategoryCard({ category }) {
    return (
        <Link
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 hover:border-primary-200"
        >
            {/* Category icon / image */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-100">
                {category.icon}
            </div>

            {/* Category name */}
            <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                {category.name}
            </span>
        </Link>
    );
}
