import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const { cartCount } = useApp()

    const navItems = [
        { path: '/home', icon: 'home', label: 'Home' },
        { path: '/search', icon: 'search', label: 'Search' },
        { path: '/orders', icon: 'receipt_long', label: 'Orders', badge: cartCount > 0 },
        { path: '/profile', icon: 'person', label: 'Profile' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="bottom-nav">
            <div className="nav-items">
                {navItems.slice(0, 2).map(item => (
                    <button
                        key={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                        id={`nav-${item.label.toLowerCase()}`}
                    >
                        <div style={{ position: 'relative' }}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}

                {/* Center floating button */}
                <div className="center-btn">
                    <button onClick={() => navigate('/cart')} id="nav-cart-btn">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                {navItems.slice(2).map(item => (
                    <button
                        key={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                        id={`nav-${item.label.toLowerCase()}`}
                    >
                        <div style={{ position: 'relative' }}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.badge && <span className="notification-dot" />}
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    )
}
