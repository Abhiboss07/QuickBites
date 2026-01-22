import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import './dashboard.css'; // Reuse basic styles

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Login
        if (email && password) {
            localStorage.setItem('adminToken', 'mock-jwt-token');
            navigate('/');
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <div className="logo-icon" style={{ margin: '0 auto 1rem', width: 60, height: 60 }}>
                        <UtensilsCrossed size={32} color="white" />
                    </div>
                    <h2 className="logo-text logo-font">Quick<span>Bites</span></h2>
                    <p style={{ color: '#8b7e7e', marginTop: '0.5rem' }}>Admin Portal Login</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffaf5',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '3rem 2rem',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
    }
};

export default Login;
