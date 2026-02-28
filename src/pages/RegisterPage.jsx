import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [strength, setStrength] = useState(0); // 0-4

    const pageRef = useRef(null);
    const leftRef = useRef(null);
    const cardRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(leftRef.current,
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            gsap.fromTo(cardRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.15 }
            );
            gsap.fromTo(
                cardRef.current.querySelectorAll('.anim-child'),
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.35 }
            );
            gsap.to(orb1Ref.current, { y: -24, x: 12, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to(orb2Ref.current, { y: 16, x: -10, duration: 7.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const calcStrength = (pw) => {
        let s = 0;
        if (pw.length >= 6) s++;
        if (pw.length >= 10) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[^a-zA-Z0-9]/.test(pw)) s++;
        return s;
    };

    const handleChange = (e) => {
        const next = { ...formData, [e.target.name]: e.target.value };
        setFormData(next);
        setError('');
        if (e.target.name === 'password') setStrength(calcStrength(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            gsap.to(cardRef.current, {
                scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out',
                onComplete: () => navigate('/'),
            });
        } catch (err) {
            setError(err.message || 'Registration failed.');
            gsap.fromTo(cardRef.current, { x: 0 }, {
                keyframes: { x: [0, -8, 8, -8, 8, 0] },
                duration: 0.45, ease: 'none',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFocus = (e) => {
        const w = e.target.closest('.input-wrap');
        if (w) gsap.to(w, { scale: 1.012, duration: 0.22, ease: 'power2.out' });
    };
    const onBlur = (e) => {
        const w = e.target.closest('.input-wrap');
        if (w) gsap.to(w, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const focusStyle = (e) => {
        e.target.style.borderColor = '#818cf8';
        e.target.style.background = '#fff';
        e.target.style.boxShadow = '0 0 0 3.5px rgba(99,102,241,0.14)';
    };
    const blurStyle = (e) => {
        e.target.style.borderColor = '#e5e7eb';
        e.target.style.background = '#fafafa';
        e.target.style.boxShadow = 'none';
    };

    const inputBase = {
        width: '100%', boxSizing: 'border-box',
        padding: '12px 14px 12px 42px',
        borderRadius: 12, fontSize: '0.9rem',
        border: '1.5px solid #e5e7eb',
        background: '#fafafa', color: '#111827', outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    };

    const strengthColors = ['#e5e7eb', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div ref={pageRef} style={{
            minHeight: '100vh', display: 'flex',
            background: '#f8f7ff',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            {/* ── Left brand panel ── */}
            <div
                ref={leftRef}
                className="hidden lg:flex"
                style={{
                    flex: '0 0 42%', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(145deg, #312e81 0%, #4f46e5 45%, #6d28d9 100%)',
                    flexDirection: 'column', justifyContent: 'center',
                    padding: '60px 56px', color: '#fff',
                }}
            >
                <div ref={orb1Ref} style={{
                    position: 'absolute', top: '6%', right: '8%',
                    width: 260, height: 260, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.32) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div ref={orb2Ref} style={{
                    position: 'absolute', bottom: '10%', left: '3%',
                    width: 190, height: 190, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.38) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.05,
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '28px 28px', pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: 'rgba(255,255,255,0.17)',
                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                    </div>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.04em' }}>ShopVerse</span>
                </div>

                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.03em', marginBottom: 14 }}>
                    Join 2 million+<br />
                    <span style={{ opacity: 0.82 }}>happy shoppers.</span>
                </h2>
                <p style={{ fontSize: '1rem', opacity: 0.75, lineHeight: 1.7, maxWidth: 320, marginBottom: 44 }}>
                    Create your free account in seconds and unlock a world of premium products.
                </p>

                {/* Steps */}
                {[
                    { n: '01', title: 'Create your account', desc: 'Quick & secure signup' },
                    { n: '02', title: 'Browse products', desc: 'Thousands of categories' },
                    { n: '03', title: 'Fast checkout', desc: 'Saved addresses & cards' },
                ].map(({ n, title, desc }) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.22)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.72rem', fontWeight: 700, opacity: 0.9, letterSpacing: '0.02em',
                        }}>{n}</div>
                        <div>
                            <p style={{ margin: '2px 0 2px', fontWeight: 700, fontSize: '0.9rem' }}>{title}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.65 }}>{desc}</p>
                        </div>
                    </div>
                ))}

                <div style={{
                    marginTop: 40, padding: '18px 22px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.17)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★</span>)}
                        <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: 6 }}>4.9/5 rating</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.82, lineHeight: 1.65, margin: '0 0 10px' }}>
                        "Best shopping experience I've ever had. The interface is beautiful and checkout is a breeze!"
                    </p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.75, margin: 0 }}>— Arjun Mehta, Bangalore</p>
                </div>
            </div>

            {/* ── Right: form ── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '36px 24px', overflowY: 'auto',
            }}>
                <div ref={cardRef} style={{ width: '100%', maxWidth: 440 }}>

                    {/* Mobile logo */}
                    <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 52, height: 52, borderRadius: 16,
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            boxShadow: '0 4px 20px rgba(79,70,229,0.38)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </div>
                    </div>

                    <div className="anim-child" style={{ marginBottom: 6 }}>
                        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.035em', color: '#111827', margin: 0 }}>
                            Create account ✨
                        </h1>
                    </div>
                    <p className="anim-child" style={{ fontSize: '0.925rem', color: '#6b7280', marginBottom: 28, lineHeight: 1.6 }}>
                        Join ShopVerse and start shopping today — it's free!
                    </p>

                    {error && (
                        <div style={{
                            borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca',
                            padding: '12px 16px', marginBottom: 18,
                            fontSize: '0.875rem', color: '#dc2626',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Full Name */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Full Name</label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input id="name" name="name" type="text" required
                                    value={formData.name} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    onFocusCapture={focusStyle} onBlurCapture={blurStyle}
                                    placeholder="John Doe" style={inputBase} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Email Address</label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    onFocusCapture={focusStyle} onBlurCapture={blurStyle}
                                    placeholder="you@example.com" style={inputBase} />
                            </div>
                        </div>

                        {/* Password + strength */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Password</label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input id="password" name="password" type={showPass ? 'text' : 'password'} required
                                    value={formData.password} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    onFocusCapture={focusStyle} onBlurCapture={blurStyle}
                                    placeholder="Minimum 6 characters"
                                    style={{ ...inputBase, paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}>
                                    {showPass
                                        ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {/* Strength meter */}
                            {formData.password && (
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{
                                                flex: 1, height: 4, borderRadius: 4,
                                                background: i <= strength ? strengthColors[strength] : '#e5e7eb',
                                                transition: 'background 0.3s',
                                            }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: strengthColors[strength], margin: 0, fontWeight: 600 }}>
                                        {strengthLabels[strength]}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="anim-child">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Confirm Password</label>
                            <div className="input-wrap" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    onFocus={onFocus} onBlur={onBlur}
                                    onFocusCapture={focusStyle} onBlurCapture={blurStyle}
                                    placeholder="Re-enter your password"
                                    style={{ ...inputBase, paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}>
                                    {showConfirm
                                        ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="anim-child" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <input type="checkbox" required style={{ marginTop: 2, width: 16, height: 16, accentColor: '#4f46e5', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.55 }}>
                                I agree to the{' '}
                                <a href="#" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
                            </span>
                        </div>

                        {/* Submit */}
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
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) gsap.to(e.currentTarget, { y: -2, scale: 1.02, boxShadow: '0 8px 24px rgba(79,70,229,0.48)', duration: 0.25, ease: 'power2.out' });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { y: 0, scale: 1, boxShadow: '0 4px 18px rgba(79,70,229,0.35)', duration: 0.45, ease: 'elastic.out(1,0.55)' });
                                }}
                            >
                                {loading ? (
                                    <>
                                        <svg style={{ width: 16, height: 16 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="anim-child" style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: 24 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#3730a3'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
                        >
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
