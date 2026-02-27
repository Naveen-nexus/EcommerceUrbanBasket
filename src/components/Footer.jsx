import { Link } from 'react-router-dom';

/**
 * Footer — Site-wide footer with links, newsletter, and social icons.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Shop: [
            { label: 'All Products', to: '/products' },
            { label: 'Electronics', to: '/products?category=Electronics' },
            { label: 'Fashion', to: '/products?category=Fashion' },
            { label: 'Home & Living', to: '/products?category=Home+%26+Living' },
        ],
        Company: [
            { label: 'About Us', to: '#' },
            { label: 'Careers', to: '#' },
            { label: 'Press', to: '#' },
            { label: 'Blog', to: '#' },
        ],
        Support: [
            { label: 'Help Center', to: '#' },
            { label: 'Shipping Info', to: '#' },
            { label: 'Returns', to: '#' },
            { label: 'Contact Us', to: '#' },
        ],
        Legal: [
            { label: 'Privacy Policy', to: '#' },
            { label: 'Terms of Service', to: '#' },
            { label: 'Cookie Policy', to: '#' },
        ],
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Newsletter banner */}
            <div className="border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div>
                            <h3 className="text-xl font-bold text-white">Stay in the loop</h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Subscribe for exclusive deals, new arrivals, and style tips.
                            </p>
                        </div>
                        <form className="flex w-full max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-full border border-gray-700 bg-gray-800 px-5 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                className="shrink-0 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Links grid */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                                S
                            </div>
                            <span className="text-xl font-bold text-white">
                                Shop<span className="text-primary-400">Verse</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                            Your one-stop destination for premium products. Quality you can trust, prices you'll love.
                        </p>
                        {/* Social icons */}
                        <div className="mt-5 flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-primary-600 hover:text-white"
                                    aria-label={social}
                                >
                                    <SocialIcon name={social} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                                {heading}
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-gray-400 transition-colors hover:text-primary-400"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-gray-500">
                            © {currentYear} ShopVerse. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">We accept</span>
                            <div className="flex gap-2 text-gray-400">
                                {['Visa', 'MC', 'Amex', 'PayPal'].map((card) => (
                                    <span key={card} className="rounded bg-gray-800 px-2 py-1 text-[10px] font-medium">
                                        {card}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/** Simple SVG social media icons */
function SocialIcon({ name }) {
    const icons = {
        facebook: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
        twitter: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />,
        instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
        youtube: <><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></>,
    };
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {icons[name]}
        </svg>
    );
}
