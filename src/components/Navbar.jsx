import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { gsap } from 'gsap';

// ── Shared easing tokens ────────────────────────────────────────────────────
const EASE_OUT = 'power3.out';
const EASE_IN = 'power2.in';
const EASE_SPRING = 'elastic.out(1, 0.55)';

/**
 * Navbar — Main navigation bar with GSAP-powered animations.
 *
 * Hover system:
 *  - Icon buttons: lift (translateY -2) + scale(1.08) + colour swap
 *  - Nav text links: colour + subtle background fill
 *  - CTA "Sign Up": scale + shadow bloom + slight lift
 *  - User avatar button: border glow pulse
 *  - Dropdown items: background slide via inline style transition
 *  - Magnetic drift on CTA + cart icon for premium feel
 *  - All returns use spring / elastic ease for natural snap-back
 */
export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);

    const navRef = useRef(null);
    const logoRef = useRef(null);
    const searchRef = useRef(null);
    const actionsRef = useRef(null);
    const userMenuRef = useRef(null);
    const dropdownRef = useRef(null);
    const mobileMenuContainerRef = useRef(null);
    const cartBadgeRef = useRef(null);
    const prevCartCount = useRef(cartCount);

    // ── Mount stagger ────────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([logoRef.current, searchRef.current, actionsRef.current], { opacity: 0, y: -18 });
            gsap.to([logoRef.current, searchRef.current, actionsRef.current], {
                opacity: 1, y: 0,
                duration: 0.6, stagger: 0.1, ease: EASE_OUT, delay: 0.05,
            });
        }, navRef);
        return () => ctx.revert();
    }, []);

    // ── Scroll shadow ────────────────────────────────────────────────────────
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        if (!navRef.current) return;
        gsap.to(navRef.current, {
            boxShadow: scrolled
                ? '0 8px 32px -8px rgba(79,70,229,0.14), 0 2px 8px -2px rgba(0,0,0,0.07)'
                : '0 1px 3px 0 rgba(0,0,0,0.05)',
            duration: 0.5, ease: EASE_OUT,
        });
    }, [scrolled]);

    // ── Cart badge bounce ────────────────────────────────────────────────────
    useEffect(() => {
        if (cartCount !== prevCartCount.current && cartBadgeRef.current) {
            gsap.fromTo(cartBadgeRef.current,
                { scale: 0.35, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)' }
            );
        }
        prevCartCount.current = cartCount;
    }, [cartCount]);

    // ── User dropdown GSAP ───────────────────────────────────────────────────
    useEffect(() => {
        if (!dropdownRef.current) return;
        if (userMenuOpen) {
            gsap.fromTo(dropdownRef.current,
                { opacity: 0, y: -12, scale: 0.95, transformOrigin: 'top right' },
                { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: EASE_OUT }
            );
        }
    }, [userMenuOpen]);

    // ── Mobile menu GSAP ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!mobileMenuContainerRef.current) return;
        if (mobileMenuOpen) {
            gsap.fromTo(mobileMenuContainerRef.current,
                { opacity: 0, y: -10, height: 0 },
                { opacity: 1, y: 0, height: 'auto', duration: 0.4, ease: EASE_OUT }
            );
            const links = mobileMenuContainerRef.current.querySelectorAll('.mobile-link');
            gsap.fromTo(links,
                { opacity: 0, x: -16 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.07, ease: EASE_OUT, delay: 0.14 }
            );
        }
    }, [mobileMenuOpen]);

    // ── Outside click ────────────────────────────────────────────────────────
    useEffect(() => {
        const fn = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    // ── Magnetic drift (shared) ──────────────────────────────────────────────
    const addMagnetic = useCallback((el) => {
        if (!el) return;
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
            gsap.to(el, { x: dx, y: dy, duration: 0.38, ease: EASE_OUT });
        };
        const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: EASE_SPRING });
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        // No cleanup return (ref callback pattern)
    }, []);

    // ── Icon-button hover (lift + colour) ───────────────────────────────────
    const iconEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -2, scale: 1.08,
            backgroundColor: 'rgba(79,70,229,0.10)',
            color: '#4f46e5',
            duration: 0.28, ease: EASE_OUT,
        });
    };
    const iconLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0, scale: 1,
            backgroundColor: 'transparent',
            color: '#4b5563',
            duration: 0.45, ease: EASE_SPRING,
        });
    };

    // ── Text-link hover ──────────────────────────────────────────────────────
    const linkEnter = (e, active) => {
        if (active) return;
        gsap.to(e.currentTarget, {
            color: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.07)',
            duration: 0.22, ease: EASE_OUT,
        });
    };
    const linkLeave = (e, active) => {
        if (active) return;
        gsap.to(e.currentTarget, {
            color: '#4b5563',
            backgroundColor: 'transparent',
            duration: 0.32, ease: EASE_OUT,
        });
    };

    // ── CTA button hover (lift + shadow bloom) ───────────────────────────────
    const ctaEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -2, scale: 1.045,
            boxShadow: '0 8px 22px rgba(79,70,229,0.50)',
            duration: 0.28, ease: EASE_OUT,
        });
    };
    const ctaLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0, scale: 1,
            boxShadow: '0 4px 14px rgba(79,70,229,0.30)',
            duration: 0.55, ease: EASE_SPRING,
        });
    };

    // ── User avatar button hover ─────────────────────────────────────────────
    const avatarEnter = (e) => {
        gsap.to(e.currentTarget, {
            borderColor: '#818cf8',
            boxShadow: '0 0 0 3px rgba(99,102,241,0.14)',
            duration: 0.25, ease: EASE_OUT,
        });
    };
    const avatarLeave = (e) => {
        if (userMenuOpen) return;
        gsap.to(e.currentTarget, {
            borderColor: '#e5e7eb',
            boxShadow: 'none',
            duration: 0.3, ease: EASE_OUT,
        });
    };

    // ── Sign-In ghost button hover ───────────────────────────────────────────
    const ghostEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -1,
            backgroundColor: '#f3f4f6',
            color: '#111827',
            duration: 0.22, ease: EASE_OUT,
        });
    };
    const ghostLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            backgroundColor: 'transparent',
            color: '#4b5563',
            duration: 0.38, ease: EASE_SPRING,
        });
    };

    // ── Helpers ──────────────────────────────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    const handleMobileToggle = () => {
        if (mobileMenuOpen && mobileMenuContainerRef.current) {
            gsap.to(mobileMenuContainerRef.current, {
                opacity: 0, y: -8, height: 0,
                duration: 0.25, ease: EASE_IN,
                onComplete: () => setMobileMenuOpen(false),
            });
        } else {
            setMobileMenuOpen(true);
        }
    };

    const handleUserMenuToggle = () => {
        if (userMenuOpen && dropdownRef.current) {
            gsap.to(dropdownRef.current, {
                opacity: 0, y: -8, scale: 0.96,
                duration: 0.2, ease: EASE_IN,
                onComplete: () => setUserMenuOpen(false),
            });
        } else {
            setUserMenuOpen(true);
        }
    };

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    // ────────────────────────────────────────────────────────────────────────
    return (
        <nav
            ref={navRef}
            style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                borderBottom: '1px solid rgba(229,231,235,0.65)',
            }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* ── Logo ── */}
                    <Link
                        ref={logoRef}
                        to="/"
                        className="flex items-center gap-2.5 shrink-0 group"
                        style={{ textDecoration: 'none' }}
                        onMouseEnter={(e) => {
                            gsap.to(e.currentTarget.querySelector('.logo-icon'), {
                                rotate: -8, scale: 1.13, duration: 0.32, ease: EASE_OUT,
                            });
                            gsap.to(e.currentTarget.querySelector('.logo-text'), {
                                x: 3, duration: 0.3, ease: EASE_OUT,
                            });
                            gsap.to(e.currentTarget.querySelector('.logo-sparkle'), {
                                opacity: 1, scale: 1.3, rotate: 20, duration: 0.35, ease: EASE_OUT,
                            });
                        }}
                        onMouseLeave={(e) => {
                            gsap.to(e.currentTarget.querySelector('.logo-icon'), {
                                rotate: 0, scale: 1, duration: 0.6, ease: EASE_SPRING,
                            });
                            gsap.to(e.currentTarget.querySelector('.logo-text'), {
                                x: 0, duration: 0.5, ease: EASE_SPRING,
                            });
                            gsap.to(e.currentTarget.querySelector('.logo-sparkle'), {
                                opacity: 0.5, scale: 1, rotate: 0, duration: 0.4, ease: EASE_OUT,
                            });
                        }}
                    >
                        {/* Shopping bag icon */}
                        <div
                            className="logo-icon flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                boxShadow: '0 4px 16px rgba(79,70,229,0.40)',
                                flexShrink: 0,
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </div>

                        {/* Wordmark */}
                        <div className="logo-text hidden sm:flex items-center gap-0.5">
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                color: '#111827',
                                lineHeight: 1,
                            }}>
                                Shop
                            </span>
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                lineHeight: 1,
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                Verse
                            </span>
                            {/* Sparkle accent */}
                            <svg
                                className="logo-sparkle"
                                style={{ opacity: 0.5, marginLeft: 1, flexShrink: 0 }}
                                width="10" height="10" viewBox="0 0 24 24" fill="#7c3aed"
                            >
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                        </div>
                    </Link>

                    {/* ── Search (desktop) ── */}
                    <form ref={searchRef} onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, brands and more..."
                                style={{
                                    width: '100%', borderRadius: 9999,
                                    border: '1.5px solid #e5e7eb', background: '#f8fafc',
                                    padding: '10px 16px 10px 44px', fontSize: '0.875rem',
                                    color: '#374151', outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#818cf8';
                                    e.target.style.background = '#fff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.13)';
                                    gsap.to(e.target, { scale: 1.012, duration: 0.25, ease: EASE_OUT });
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.background = '#f8fafc';
                                    e.target.style.boxShadow = 'none';
                                    gsap.to(e.target, { scale: 1, duration: 0.3, ease: EASE_OUT });
                                }}
                            />
                            <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    {/* ── Right actions ── */}
                    <div ref={actionsRef} className="flex items-center gap-1 sm:gap-2">

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-0.5 mr-1">
                            {[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }].map(({ label, to }) => {
                                const active = isActive(to);
                                return (
                                    <Link
                                        key={to} to={to}
                                        className="relative px-3 py-1.5 text-sm font-medium rounded-lg"
                                        style={{
                                            color: active ? '#4f46e5' : '#4b5563',
                                            background: active ? 'rgba(79,70,229,0.08)' : 'transparent',
                                            textDecoration: 'none',
                                            transition: 'none',   // GSAP owns transitions
                                        }}
                                        onMouseEnter={(e) => linkEnter(e, active)}
                                        onMouseLeave={(e) => linkLeave(e, active)}
                                    >
                                        {label}
                                        {active && (
                                            <span style={{
                                                position: 'absolute', bottom: 2, left: '50%',
                                                transform: 'translateX(-50%)', width: '60%',
                                                height: 2, borderRadius: 2, background: '#4f46e5',
                                            }} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Cart icon button */}
                        <Link
                            to="/cart"
                            ref={addMagnetic}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ color: '#4b5563', textDecoration: 'none' }}
                            onMouseEnter={iconEnter}
                            onMouseLeave={iconLeave}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {cartCount > 0 && (
                                <span
                                    ref={cartBadgeRef}
                                    style={{
                                        position: 'absolute', top: -2, right: -2,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        height: 20, minWidth: 20, borderRadius: 999,
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        color: '#fff', fontSize: 10, fontWeight: 700, padding: '0 4px',
                                        boxShadow: '0 2px 8px rgba(79,70,229,0.40)',
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth section */}
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={handleUserMenuToggle}
                                    className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium"
                                    style={{
                                        border: '1.5px solid', cursor: 'pointer',
                                        borderColor: userMenuOpen ? '#818cf8' : '#e5e7eb',
                                        background: userMenuOpen ? 'rgba(99,102,241,0.06)' : '#fff',
                                        color: '#374151',
                                        boxShadow: userMenuOpen ? '0 0 0 3px rgba(99,102,241,0.13)' : 'none',
                                        transition: 'none',
                                    }}
                                    onMouseEnter={avatarEnter}
                                    onMouseLeave={avatarLeave}
                                >
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        height: 28, width: 28, borderRadius: 999,
                                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                        color: '#4338ca', fontSize: 11, fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                                    <svg style={{
                                        width: 14, height: 14, flexShrink: 0,
                                        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                                        transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div ref={dropdownRef} style={{
                                        position: 'absolute', right: 0, marginTop: 8, width: 224,
                                        borderRadius: 16, border: '1px solid #f0f0f0', background: '#fff',
                                        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.14), 0 4px 16px -4px rgba(79,70,229,0.10)',
                                        padding: '8px 0', overflow: 'hidden',
                                    }}>
                                        {/* Header */}
                                        <div style={{ padding: '10px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    height: 34, width: 34, borderRadius: 999,
                                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                                    color: '#fff', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0,
                                                }}>
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', margin: 0 }}>{user.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Links */}
                                        {[
                                            {
                                                to: '/account', label: 'My Account',
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                                            },
                                            ...(user.role === 'admin' ? [{
                                                to: '/admin', label: 'Admin Dashboard',
                                                icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
                                            }] : []),
                                        ].map(({ to, label, icon }) => (
                                            <Link
                                                key={to} to={to}
                                                onClick={() => setUserMenuOpen(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 12,
                                                    padding: '10px 16px', fontSize: '0.875rem',
                                                    color: '#374151', textDecoration: 'none',
                                                    transition: 'background 0.18s ease, padding-left 0.18s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f5f3ff';
                                                    e.currentTarget.style.color = '#4f46e5';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#374151';
                                                    e.currentTarget.style.paddingLeft = '16px';
                                                }}
                                            >
                                                <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                                                {label}
                                            </Link>
                                        ))}

                                        <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f3f4f6' }} />

                                        <button
                                            onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                                            style={{
                                                display: 'flex', width: '100%', alignItems: 'center', gap: 12,
                                                padding: '10px 16px', fontSize: '0.875rem',
                                                color: '#dc2626', background: 'none', border: 'none',
                                                cursor: 'pointer', textAlign: 'left',
                                                transition: 'background 0.18s ease, padding-left 0.18s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#fef2f2';
                                                e.currentTarget.style.paddingLeft = '20px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.paddingLeft = '16px';
                                            }}
                                        >
                                            <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="rounded-full px-4 py-2 text-sm font-medium"
                                    style={{ color: '#4b5563', textDecoration: 'none' }}
                                    onMouseEnter={ghostEnter}
                                    onMouseLeave={ghostLeave}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    ref={addMagnetic}
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        boxShadow: '0 4px 14px rgba(79,70,229,0.30)',
                                        textDecoration: 'none', display: 'inline-block',
                                    }}
                                    onMouseEnter={ctaEnter}
                                    onMouseLeave={ctaLeave}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile toggle */}
                        <button
                            onClick={handleMobileToggle}
                            ref={addMagnetic}
                            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
                            style={{ color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={iconEnter}
                            onMouseLeave={iconLeave}
                            aria-label="Toggle menu"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Mobile menu ── */}
                {mobileMenuOpen && (
                    <div
                        ref={mobileMenuContainerRef}
                        style={{ overflow: 'hidden', borderTop: '1px solid #f3f4f6' }}
                        className="md:hidden"
                    >
                        <form onSubmit={handleSearch} className="py-3 px-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    style={{
                                        width: '100%', borderRadius: 9999,
                                        border: '1.5px solid #e5e7eb', background: '#f8fafc',
                                        padding: '9px 16px 9px 40px', fontSize: '0.875rem',
                                        color: '#374151', outline: 'none', boxSizing: 'border-box',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                                />
                                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </form>

                        <div style={{ padding: '0 8px 12px' }}>
                            {[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }].map(({ label, to }) => (
                                <Link
                                    key={to} to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="mobile-link block rounded-xl px-4 py-2.5 text-sm font-medium"
                                    style={{
                                        color: isActive(to) ? '#4f46e5' : '#4b5563',
                                        background: isActive(to) ? 'rgba(79,70,229,0.07)' : 'transparent',
                                        textDecoration: 'none', marginBottom: 2,
                                        transition: 'background 0.2s, color 0.2s, padding-left 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(79,70,229,0.08)';
                                        e.currentTarget.style.color = '#4f46e5';
                                        e.currentTarget.style.paddingLeft = '20px';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isActive(to) ? 'rgba(79,70,229,0.07)' : 'transparent';
                                        e.currentTarget.style.color = isActive(to) ? '#4f46e5' : '#4b5563';
                                        e.currentTarget.style.paddingLeft = '16px';
                                    }}
                                >
                                    {label}
                                </Link>
                            ))}

                            {!user && (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mobile-link block rounded-xl px-4 py-2.5 text-sm font-medium"
                                        style={{
                                            textDecoration: 'none', marginBottom: 2,
                                            color: '#4b5563', transition: 'background 0.2s, color 0.2s, padding-left 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f3f4f6';
                                            e.currentTarget.style.color = '#111827';
                                            e.currentTarget.style.paddingLeft = '20px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#4b5563';
                                            e.currentTarget.style.paddingLeft = '16px';
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mobile-link block rounded-xl px-4 py-2.5 text-sm font-semibold text-center text-white"
                                        style={{
                                            textDecoration: 'none',
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            boxShadow: '0 4px 14px rgba(79,70,229,0.28)',
                                            transition: 'box-shadow 0.2s, transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.45)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.28)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
