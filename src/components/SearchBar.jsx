import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SearchBar — Standalone search input component.
 * Navigates to /products with a search query param.
 */
export default function SearchBar({ placeholder = 'Search products...', className = '' }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-5 text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-primary-400 focus:shadow-md focus:ring-2 focus:ring-primary-100"
            />
            <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </form>
    );
}
