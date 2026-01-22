import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import './Login.css';

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
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <UtensilsCrossed size={36} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 className="brand-title">Quick<span>Bites</span></h2>
                    <p className="login-subtitle">Admin Portal Login</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="modern-input"
                            placeholder="admin@quickbites.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="modern-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
