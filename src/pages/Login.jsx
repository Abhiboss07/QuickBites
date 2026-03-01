import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()
        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }
        if (!password.trim()) {
            setError('Please enter your password')
            return
        }
        // Simulate login
        navigate('/home')
    }

    return (
        <div className="page" style={{ background: 'var(--bg-light)', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1.5rem' }}>
                <button
                    className="btn-icon"
                    onClick={() => navigate('/')}
                    id="login-back-btn"
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
                    width: '100%', height: '140px', borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden', position: 'relative',
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
                        alt="Delicious healthy food bowl"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Yum badge */}
                    <div style={{
                        position: 'absolute', bottom: '1rem', right: '1rem',
                        background: 'var(--accent)', padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)', fontWeight: 700,
                        fontSize: '0.875rem', boxShadow: 'var(--shadow-cartoon)',
                    }}>
                        Yum! 😋
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 className="animate-fadeIn" style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.25rem' }}>
                    Time to Feast! 🍔
                </h1>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    Log in to track your munchies and discover new treats.
                </p>

                {error && (
                    <div className="animate-bounceIn" style={{
                        background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Email */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">mail</span>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError('') }}
                            id="email-input"
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">lock</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError('') }}
                            id="password-input"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                            id="toggle-password"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>

                    {/* Forgot password */}
                    <div style={{ textAlign: 'right' }}>
                        <button type="button" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }} id="forgot-password">
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login button */}
                    <button type="submit" className="btn-primary" id="login-btn" style={{ marginTop: '0.5rem' }}>
                        <span>Let's Eat</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
                    </button>
                </form>

                {/* Divider */}
                <div className="divider-text" style={{ margin: '1rem 0' }}>
                    <span>or continue with</span>
                </div>

                {/* Social buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button className="social-btn social-google" id="google-login" onClick={() => navigate('/home')} style={{ width: '3rem', height: '3rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>G</span>
                    </button>
                    <button className="social-btn social-facebook" id="facebook-login" onClick={() => navigate('/home')} style={{ width: '3rem', height: '3rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>f</span>
                    </button>
                    <button className="social-btn social-apple" id="apple-login" onClick={() => navigate('/home')} style={{ width: '3rem', height: '3rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>
                            laptop_mac
                        </span>
                    </button>
                </div>

                {/* Sign up link */}
                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/home')}
                        style={{ color: 'var(--primary)', fontWeight: 700 }}
                        id="signup-link"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    )
}
