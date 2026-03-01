import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { onboardingSlides } from '../data/restaurants'

export default function Onboarding() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const goNext = useCallback(() => {
        setCurrent(prev => (prev < onboardingSlides.length - 1 ? prev + 1 : prev))
    }, [])

    const goPrev = useCallback(() => {
        setCurrent(prev => (prev > 0 ? prev - 1 : prev))
    }, [])

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX)
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
    const handleTouchEnd = () => {
        if (!touchEnd) return
        const distance = touchStart - touchEnd
        if (distance > 50) goNext()
        if (distance < -50) goPrev()
        setTouchEnd(0)
    }

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % onboardingSlides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const slide = onboardingSlides[current]

    return (
        <div className="page" style={{ background: 'var(--bg-light)' }}>
            {/* Subtle pattern background */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(#f47b25 1.5px, transparent 1.5px), radial-gradient(#f47b25 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
            }} />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
                {/* Image section */}
                <div
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '3rem 1.5rem 1.5rem' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div style={{
                        width: '100%', aspectRatio: '4/5', maxHeight: '55vh',
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        borderRadius: 'var(--radius-xl)',
                        transition: 'background-image 0.5s ease',
                        animation: 'fadeIn 0.5s ease',
                    }}
                        key={current}
                    />
                </div>

                {/* Content section */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: 'var(--bg-light)', padding: '2rem',
                    borderRadius: '3rem 3rem 0 0', marginTop: '-1.5rem',
                    boxShadow: '0 -10px 40px -15px rgba(0,0,0,0.1)',
                    position: 'relative', zIndex: 20,
                }}>
                    {/* Handle bar */}
                    <div style={{ width: '3rem', height: '0.375rem', background: '#e2e8f0', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }} />

                    {/* Icon */}
                    <div style={{
                        display: 'inline-flex', padding: '0.75rem', background: 'rgba(244,123,37,0.1)',
                        borderRadius: 'var(--radius-full)', marginBottom: '1rem',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>{slide.icon}</span>
                    </div>

                    {/* Title */}
                    <h1
                        className="animate-fadeIn"
                        key={`title-${current}`}
                        style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', textAlign: 'center' }}
                    >
                        {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="animate-fadeIn"
                        key={`sub-${current}`}
                        style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.6, textAlign: 'center', marginBottom: '2rem', maxWidth: '320px' }}
                    >
                        {slide.subtitle}
                    </p>

                    {/* Dot indicators */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        {onboardingSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                style={{
                                    width: i === current ? '2rem' : '0.5rem',
                                    height: '0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: i === current ? 'var(--primary)' : '#cbd5e1',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                id={`dot-${i}`}
                            />
                        ))}
                    </div>

                    {/* Get Started button */}
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/login')}
                        id="get-started-btn"
                    >
                        <span>Get Started</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
                    </button>

                    {/* Login link */}
                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                            id="login-link"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
