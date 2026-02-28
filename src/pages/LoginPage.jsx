import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Refs
    const pageRef = useRef(null);
    const leftRef = useRef(null);
    const cardRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);
    const orb3Ref = useRef(null);

    // ── Entrance animation ────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Left panel slides in
            gsap.fromTo(leftRef.current,
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            // Card slides up
            gsap.fromTo(cardRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.15 }
            );
            // Stagger inner card children
            gsap.fromTo(
                cardRef.current.querySelectorAll('.anim-child'),
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power2.out', delay: 0.35 }
            );

            // Floating orbs
            gsap.to(orb1Ref.current, { y: -28, x: 10, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to(orb2Ref.current, { y: 18, x: -14, duration: 6.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
            gsap.to(orb3Ref.current, { y: -14, x: 20, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // Shake animation on submit
        gsap.fromTo(cardRef.current, { x: 0 }, {
            x: 0, duration: 0.4, ease: 'none',
            keyframes: { x: [0, -6, 6, -6, 6, -4, 4, 0] },
        });
        try {
            await login(formData.email, formData.password);
            // Success flash
            gsap.to(cardRef.current, {
                scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out',
                onComplete: () => navigate('/'),
            });
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            gsap.fromTo(cardRef.current, { x: 0 }, {
                keyframes: { x: [0, -8, 8, -8, 8, -4, 4, 0] },
                duration: 0.5, ease: 'none',
            });
        } finally {
            setLoading(false);
        }
    };

    // Input focus GSAP
    const onFocus = (e) => {
        const wrapper = e.target.closest('.input-wrap');
        if (wrapper) gsap.to(wrapper, { scale: 1.012, duration: 0.22, ease: 'power2.out' });
    };
    const onBlur = (e) => {
        const wrapper = e.target.closest('.input-wrap');
        if (wrapper) gsap.to(wrapper, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    return (
        <div
            ref={pageRef}
            style={{
                minHeight: '100vh',
                display: 'flex',
                background: '#f8f7ff',
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            {/* ── Left brand panel ── */}
            <div
                ref={leftRef}
                className="hidden lg:flex"
                style={{
                    flex: '0 0 45%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(160deg, #0f0c29 0%, #1e1b4b 40%, #312e81 75%, #4c1d95 100%)',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 48px',
                    color: '#fff',
                    userSelect: 'none',
                }}
            >
                {/* Soft glow blobs */}
                <div ref={orb1Ref} style={{
                    position: 'absolute', top: '-60px', left: '-60px',
                    width: 340, height: 340, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 65%)',
                    pointerEvents: 'none', filter: 'blur(10px)',
                }} />
                <div ref={orb2Ref} style={{
                    position: 'absolute', bottom: '-80px', right: '-60px',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 65%)',
                    pointerEvents: 'none', filter: 'blur(12px)',
                }} />
                <div ref={orb3Ref} style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 420, height: 420, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                {/* Fine mesh grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.07,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                }} />

                {/* === Visual content === */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>

                    {/* Logo badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 999, padding: '8px 18px 8px 10px',
                        backdropFilter: 'blur(12px)', marginBottom: 40,
                    }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '-0.02em', opacity: 0.95 }}>ShopVerse</span>
                    </div>

                    {/* Giant glowing wordmark */}
                    <h2 style={{
                        fontSize: '4.2rem', fontWeight: 900,
                        letterSpacing: '-0.05em', lineHeight: 1.05,
                        margin: '0 0 20px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 55%, #a78bfa 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 32px rgba(167,139,250,0.55))',
                    }}>
                        Shop<br />smarter.✦
                    </h2>

                    <p style={{
                        fontSize: '1rem', opacity: 0.6, lineHeight: 1.7,
                        maxWidth: 300, marginBottom: 44,
                    }}>
                        Premium products. Lightning checkout. Delivered to your door.
                    </p>

                    {/* Floating product-preview cards */}
                    <div style={{ position: 'relative', width: '100%', height: 190, marginBottom: 40 }}>
                        {/* Card 1 — left */}
                        <div style={{
                            position: 'absolute', left: '0%', top: '10%',
                            width: 150, background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(16px)', borderRadius: 18,
                            padding: '14px 16px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                            transform: 'rotate(-5deg)',
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>👟</div>
                            <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 700, opacity: 0.95 }}>Air Runner Pro</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.55 }}>Footwear</p>
                            <p style={{ margin: '6px 0 0', fontSize: '0.82rem', fontWeight: 800, color: '#a78bfa' }}>$129</p>
                        </div>

                        {/* Card 2 — centre (larger) */}
                        <div style={{
                            position: 'absolute', left: '50%', top: '-5%',
                            transform: 'translateX(-50%)',
                            width: 160, background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(20px)', borderRadius: 18,
                            padding: '16px 18px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 6 }}>🎧</div>
                            <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 700, opacity: 0.95 }}>SonicBoom X7</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.55 }}>Electronics</p>
                            <div style={{ margin: '6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#a78bfa' }}>$249</p>
                                <span style={{ fontSize: '0.65rem', background: 'rgba(167,139,250,0.25)', color: '#c4b5fd', padding: '2px 7px', borderRadius: 999, fontWeight: 700 }}>HOT</span>
                            </div>
                        </div>

                        {/* Card 3 — right */}
                        <div style={{
                            position: 'absolute', right: '0%', top: '15%',
                            width: 148, background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(16px)', borderRadius: 18,
                            padding: '14px 16px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                            transform: 'rotate(5deg)',
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>⌚</div>
                            <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 700, opacity: 0.95 }}>SmartTime S3</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.55 }}>Accessories</p>
                            <p style={{ margin: '6px 0 0', fontSize: '0.82rem', fontWeight: 800, color: '#a78bfa' }}>$199</p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { value: '2M+', label: 'Happy shoppers' },
                            { value: '50K', label: 'Products' },
                            { value: '4.9★', label: 'Rating' },
                        ].map(({ value, label }) => (
                            <div key={label} style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 14, padding: '10px 18px',
                                textAlign: 'center', backdropFilter: 'blur(10px)',
                            }}>
                                <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{value}</p>
                                <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.55 }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right: form panel ── */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                overflowY: 'auto',
            }}>
                <div
                    ref={cardRef}
                    style={{
                        width: '100%', maxWidth: 440,
                    }}
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 52, height: 52, borderRadius: 16,
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            boxShadow: '0 4px 20px rgba(79,70,229,0.38)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="anim-child" style={{ marginBottom: 8 }}>
                        <h1 style={{
                            fontSize: '1.9rem', fontWeight: 800,
                            letterSpacing: '-0.035em', color: '#111827', margin: 0,
                        }}>Welcome back 👋</h1>
                    </div>
                    <p className="anim-child" style={{
                        fontSize: '0.925rem', color: '#6b7280',
                        marginBottom: 32, lineHeight: 1.6,
                    }}>
                        Sign in to continue to your ShopVerse account
                    </p>

                    {/* Demo hint */}
                    <div className="anim-child" style={{
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
                        border: '1px solid #c4b5fd',
                        padding: '12px 16px',
                        marginBottom: 24,
                    }}>
                        <p style={{ fontSize: '0.8rem', color: '#4338ca', margin: 0, lineHeight: 1.6 }}>
                            <strong>🔑 Demo:</strong> Use <code style={{
                                background: 'rgba(99,102,241,0.15)', borderRadius: 6,
                                padding: '1px 6px', fontSize: '0.75rem', fontFamily: 'monospace',
                            }}>admin@shopverse.com</code> for admin access, or any email for a regular account.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            borderRadius: 12, background: '#fef2f2',
                            border: '1px solid #fecaca', padding: '12px 16px',
                            marginBottom: 20, fontSize: '0.875rem', color: '#dc2626',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Email */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Email Address
                            </label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: '#9ca3af', pointerEvents: 'none',
                                }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 14px 12px 42px',
                                        borderRadius: 12, fontSize: '0.9rem',
                                        border: '1.5px solid #e5e7eb',
                                        background: '#fafafa', color: '#111827', outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                                    }}
                                    onFocusCapture={(e) => {
                                        e.target.style.borderColor = '#818cf8';
                                        e.target.style.background = '#fff';
                                        e.target.style.boxShadow = '0 0 0 3.5px rgba(99,102,241,0.14)';
                                    }}
                                    onBlurCapture={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.background = '#fafafa';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Password
                            </label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    color: '#9ca3af', pointerEvents: 'none',
                                }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password" name="password"
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={formData.password} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 44px 12px 42px',
                                        borderRadius: 12, fontSize: '0.9rem',
                                        border: '1.5px solid #e5e7eb',
                                        background: '#fafafa', color: '#111827', outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                                    }}
                                    onFocusCapture={(e) => {
                                        e.target.style.borderColor = '#818cf8';
                                        e.target.style.background = '#fff';
                                        e.target.style.boxShadow = '0 0 0 3.5px rgba(99,102,241,0.14)';
                                    }}
                                    onBlurCapture={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.background = '#fafafa';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                {/* Show/hide toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#9ca3af', padding: 0, display: 'flex',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
                                >
                                    {showPass
                                        ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="anim-child" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#4b5563' }}>
                                <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#4f46e5' }} />
                                Remember me
                            </label>
                            <a href="#" style={{
                                fontSize: '0.875rem', fontWeight: 600, color: '#4f46e5', textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#3730a3'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit button */}
                        <div className="anim-child">
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '13px 20px',
                                    borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    background: loading
                                        ? 'linear-gradient(135deg, #a5b4fc, #c4b5fd)'
                                        : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                                    boxShadow: '0 4px 18px rgba(79,70,229,0.35)',
                                    transition: 'opacity 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        gsap.to(e.currentTarget, { y: -2, scale: 1.02, boxShadow: '0 8px 24px rgba(79,70,229,0.48)', duration: 0.25, ease: 'power2.out' });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { y: 0, scale: 1, boxShadow: '0 4px 18px rgba(79,70,229,0.35)', duration: 0.45, ease: 'elastic.out(1,0.55)' });
                                }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin" style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="anim-child" style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        margin: '24px 0', color: '#d1d5db',
                    }}>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>or continue with</span>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    </div>

                    {/* Social buttons */}
                    <div className="anim-child" style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                        {[
                            {
                                label: 'Google',
                                icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
                            },
                            {
                                label: 'GitHub',
                                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
                            },
                        ].map(({ label, icon }) => (
                            <button
                                key={label}
                                type="button"
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: 8, padding: '11px 16px', borderRadius: 12,
                                    border: '1.5px solid #e5e7eb', background: '#fff',
                                    fontSize: '0.875rem', fontWeight: 600, color: '#374151',
                                    cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    gsap.to(e.currentTarget, { y: -2, boxShadow: '0 4px 14px rgba(0,0,0,0.08)', borderColor: '#c4b5fd', duration: 0.22, ease: 'power2.out' });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { y: 0, boxShadow: 'none', borderColor: '#e5e7eb', duration: 0.38, ease: 'elastic.out(1,0.55)' });
                                }}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>

                    {/* Sign up link */}
                    <p className="anim-child" style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{
                            fontWeight: 700, color: '#4f46e5', textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#3730a3'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                        >
                            Create account →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
