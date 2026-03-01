import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

export default function Profile() {
    const navigate = useNavigate()
    const { user } = useApp()

    const settings = [
        { icon: 'location_on', label: 'My Addresses', color: '#3b82f6', bg: '#eff6ff' },
        { icon: 'credit_card', label: 'Payment Methods', color: '#8b5cf6', bg: '#f5f3ff' },
        { icon: 'favorite', label: 'Favorites', color: '#ef4444', bg: '#fef2f2' },
        { icon: 'notifications', label: 'Notifications', color: '#f59e0b', bg: '#fffbeb' },
        { icon: 'help', label: 'Help & Support', color: '#10b981', bg: '#ecfdf5' },
        { icon: 'info', label: 'About QuickBites', color: '#6366f1', bg: '#eef2ff' },
    ]

    return (
        <div className="page page-with-nav">
            <div style={{ padding: '2rem 1.25rem' }}>
                {/* Profile Header */}
                <div className="animate-slideUp" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '6rem', height: '6rem', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #f97316, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(244,123,37,0.3)', border: '4px solid white', fontSize: '2.5rem' }}>
                        🍔
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
                    <button style={{ marginTop: '0.75rem', background: 'rgba(244,123,37,0.1)', color: 'var(--primary)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.875rem' }} id="edit-profile-btn">Edit Profile</button>
                </div>

                {/* Quick Stats */}
                <div className="animate-slideUp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[{ n: '12', l: 'Orders', e: '🛒' }, { n: '5', l: 'Favorites', e: '❤️' }, { n: '$156', l: 'Saved', e: '💰' }].map(s => (
                        <div key={s.l} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)', padding: '1rem', textAlign: 'center', boxShadow: 'var(--shadow-cartoon)' }}>
                            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>{s.e}</span>
                            <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{s.n}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600 }}>{s.l}</p>
                        </div>
                    ))}
                </div>

                {/* Settings List */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-cartoon)' }}>
                    {settings.map((item, i) => (
                        <div key={item.label} className="settings-item" style={{ borderBottom: i < settings.length - 1 ? '1px solid var(--border)' : 'none' }} id={`setting-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="icon-wrapper" style={{ background: item.bg }}>
                                <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                            </div>
                            <span className="settings-label">{item.label}</span>
                            <span className="material-symbols-outlined chevron">chevron_right</span>
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '2px solid #fecaca', background: '#fef2f2', color: 'var(--danger)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} id="logout-btn">
                    <span className="material-symbols-outlined">logout</span> Log Out
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
