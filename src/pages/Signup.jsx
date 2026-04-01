import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextBackend'

export default function Signup() {
    const navigate = useNavigate()
    const { register } = useApp()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!name.trim()) {
            setError('Please enter your name')
            return
        }
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters')
            return
        }
        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }
        if (!password.trim()) {
            setError('Please enter a password')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            await register({ name: name.trim(), email: email.trim(), password })
            navigate('/home')
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page" style={{ background: 'var(--bg-light)', height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1.5rem' }}>
                <button
                    className="btn-icon"
                    onClick={() => navigate('/login')}
                    id="signup-back-btn"
                    style={{ width: '2rem', height: '2rem' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>arrow_back</span>
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}>QuickBites</h2>
                <div style={{ width: '2rem' }} /> {/* Spacer for centering */}
            </div>

            {/* Hero Image */}
            <div className="animate-slideUp" style={{ padding: '0 1.5rem' }}>
                <div style={{
                    width: '100%', height: '120px', borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden', position: 'relative',
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop"
                        alt="Delicious food spread"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Badge */}
                    <div style={{
                        position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                        background: 'var(--accent)', padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-full)', fontWeight: 700,
                        fontSize: '0.8rem', boxShadow: 'var(--shadow-cartoon)',
                    }}>
                        Join Us! 🎉
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '0.75rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 className="animate-fadeIn" style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.15rem' }}>
                    Create Account 🍕
                </h1>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                    Sign up to start ordering delicious food delivered to your door.
                </p>

                {error && (
                    <div className="animate-bounceIn" style={{
                        background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
                        padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', textAlign: 'center',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Name */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">person</span>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError('') }}
                            id="signup-name-input"
                            autoComplete="name"
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">mail</span>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError('') }}
                            id="signup-email-input"
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">lock</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password (min. 6 chars)"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError('') }}
                            id="signup-password-input"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                            id="signup-toggle-password"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">lock</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                            id="signup-confirm-password-input"
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Signup button */}
                    <button type="submit" className="btn-primary" id="signup-btn" style={{ marginTop: '0.25rem' }} disabled={loading}>
                        <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                            {loading ? 'hourglass_empty' : 'arrow_forward'}
                        </span>
                    </button>
                </form>

                {/* Login link */}
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '1rem' }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{ color: 'var(--primary)', fontWeight: 700 }}
                        id="login-link"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    )
}
