import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextBackend'
import { authAPI } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function Profile() {
    const navigate = useNavigate()
    const { user, logout, orderHistory, favorites, loadOrderHistory } = useApp()
    const [showEditModal, setShowEditModal] = useState(false)
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editLoading, setEditLoading] = useState(false)
    const [editSuccess, setEditSuccess] = useState(false)
    const [editError, setEditError] = useState('')
    const [activePanel, setActivePanel] = useState(null) // 'addresses','payment','notifications','help','about'

    useEffect(() => {
        if (user) { loadOrderHistory().catch(() => {}) }
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    const settings = [
        { icon: 'location_on', label: 'My Addresses', color: '#3b82f6', bg: '#eff6ff', panel: 'addresses' },
        { icon: 'credit_card', label: 'Payment Methods', color: '#8b5cf6', bg: '#f5f3ff', panel: 'payment' },
        { icon: 'favorite', label: 'Favorites', color: '#ef4444', bg: '#fef2f2', panel: 'favorites' },
        { icon: 'notifications', label: 'Notifications', color: '#f59e0b', bg: '#fffbeb', panel: 'notifications' },
        { icon: 'help', label: 'Help & Support', color: '#10b981', bg: '#ecfdf5', panel: 'help' },
        { icon: 'info', label: 'About QuickBites', color: '#6366f1', bg: '#eef2ff', panel: 'about' },
    ]

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Order Delivered! 🎉', msg: 'Your order #5001 has been delivered', time: '2 min ago', read: false },
        { id: 2, title: 'Special Offer 🔥', msg: 'Use YUMMY20 for 20% off your next order', time: '1 hour ago', read: false },
        { id: 3, title: 'Welcome! 👋', msg: 'Thanks for joining QuickBites!', time: '1 day ago', read: true },
    ])

    if (!user) {
        return (
            <div className="page page-with-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>👤</span>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.125rem' }}>Please log in to view your profile</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Sign in to access your orders, favorites, and more</p>
                    <button className="btn-primary" onClick={() => navigate('/login')} style={{ maxWidth: '200px', margin: '0 auto' }} id="profile-login-btn">Log In</button>
                </div>
                <BottomNav />
            </div>
        )
    }

    const totalOrders = orderHistory.length
    const totalFavorites = favorites.length
    const totalSaved = orderHistory.reduce((sum, o) => sum + (o.promoDiscount || 0) * (o.subtotal || 0), 0)

    const handleLogout = () => { logout(); navigate('/') }

    const openEditModal = () => {
        setEditName(user.name || ''); setEditPhone(user.phone || '')
        setEditError(''); setEditSuccess(false); setShowEditModal(true)
    }

    const handleSaveProfile = async () => {
        if (!editName.trim()) { setEditError('Name cannot be empty'); return }
        setEditLoading(true); setEditError('')
        try {
            await authAPI.updateProfile({ name: editName.trim(), phone: editPhone.trim() || undefined })
            setEditSuccess(true)
            setTimeout(() => { setShowEditModal(false); setEditSuccess(false); window.location.reload() }, 1200)
        } catch (err) { setEditError(err.message || 'Failed to update profile') }
        finally { setEditLoading(false) }
    }

    const handleSettingClick = (item) => {
        if (item.panel === 'favorites') { navigate('/search'); return }
        setActivePanel(activePanel === item.panel ? null : item.panel)
    }

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    // Panel content renderers
    const renderPanel = () => {
        switch (activePanel) {
            case 'addresses': return (
                <div className="animate-slideUp" style={panelStyle}>
                    <div style={panelHeader}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>📍 My Addresses</h3>
                        <button onClick={() => setActivePanel(null)} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span></button>
                    </div>
                    {user.addresses && user.addresses.length > 0 ? user.addresses.map((addr, i) => (
                        <div key={addr._id || i} style={{
                            padding: '0.75rem', background: addr.isDefault ? 'rgba(244,123,37,0.05)' : '#f8fafc',
                            borderRadius: 'var(--radius-md)', marginBottom: '0.5rem',
                            border: addr.isDefault ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>{addr.type || 'Home'} {addr.isDefault && '• Default'}</span>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{addr.street}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{addr.city}{addr.state && `, ${addr.state}`} {addr.zipCode}</p>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🏠</span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No addresses saved yet</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Your delivery addresses will appear here</p>
                        </div>
                    )}
                </div>
            )
            case 'payment': return (
                <div className="animate-slideUp" style={panelStyle}>
                    <div style={panelHeader}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>💳 Payment Methods</h3>
                        <button onClick={() => setActivePanel(null)} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span></button>
                    </div>
                    {[
                        { icon: '💳', title: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets', active: true },
                        { icon: '💵', title: 'Cash on Delivery', desc: 'Pay when food arrives', active: true },
                        { icon: '📱', title: 'UPI (via Razorpay)', desc: 'Google Pay, PhonePe, Paytm', active: true },
                    ].map((pm, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem',
                            background: '#f8fafc', border: '1px solid var(--border)',
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{pm.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{pm.title}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pm.desc}</p>
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>Active</span>
                        </div>
                    ))}
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                        Payment methods are managed at checkout via Razorpay
                    </p>
                </div>
            )
            case 'notifications': return (
                <div className="animate-slideUp" style={panelStyle}>
                    <div style={panelHeader}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>🔔 Notifications</h3>
                        <button onClick={() => setActivePanel(null)} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span></button>
                    </div>
                    {notifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{
                            padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem',
                            background: n.read ? '#f8fafc' : 'rgba(244,123,37,0.05)',
                            border: n.read ? '1px solid var(--border)' : '1.5px solid var(--primary)',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.title}</p>
                                {!n.read && <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.3rem' }} />}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.msg}</p>
                            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{n.time}</p>
                        </div>
                    ))}
                </div>
            )
            case 'help': return (
                <div className="animate-slideUp" style={panelStyle}>
                    <div style={panelHeader}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>🆘 Help & Support</h3>
                        <button onClick={() => setActivePanel(null)} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span></button>
                    </div>
                    {[
                        { q: 'How do I track my order?', a: 'After placing an order, go to Orders → Track to see real-time delivery status.' },
                        { q: 'How do I apply a promo code?', a: 'Enter your code in the "Have a promo code?" section on the Cart page. Try YUMMY20 for 20% off!' },
                        { q: 'Can I cancel my order?', a: 'You can cancel within 2 minutes of placing. Go to Orders → select the order → Cancel.' },
                        { q: 'How do payments work?', a: 'We accept Razorpay (UPI, Cards, Wallets) and Cash on Delivery.' },
                        { q: 'How do I contact support?', a: 'Email us at support@quickbites.com or call 1800-QUICK-BITES.' },
                    ].map((faq, i) => (
                        <details key={i} style={{
                            padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem',
                            background: '#f8fafc', border: '1px solid var(--border)', cursor: 'pointer',
                        }}>
                            <summary style={{ fontWeight: 700, fontSize: '0.85rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {faq.q} <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>expand_more</span>
                            </summary>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>{faq.a}</p>
                        </details>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>📧 support@quickbites.com</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>We usually respond within 24 hours</p>
                    </div>
                </div>
            )
            case 'about': return (
                <div className="animate-slideUp" style={panelStyle}>
                    <div style={panelHeader}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>ℹ️ About QuickBites</h3>
                        <button onClick={() => setActivePanel(null)} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span></button>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
                        <div style={{
                            width: '4rem', height: '4rem', borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 0.75rem', fontSize: '2rem',
                            boxShadow: '0 4px 15px rgba(244,123,37,0.3)',
                        }}>🍔</div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>QuickBites</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Version 2.0.0</p>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'center', marginBottom: '0.75rem' }}>
                        QuickBites is your go-to food delivery app. Order from top restaurants, track deliveries in real-time, and enjoy delicious meals at your doorstep.
                    </p>
                    {[
                        { label: 'Privacy Policy', icon: 'privacy_tip' },
                        { label: 'Terms of Service', icon: 'gavel' },
                        { label: 'Rate Us ⭐', icon: 'star' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)',
                            background: '#f8fafc', marginBottom: '0.5rem',
                            border: '1px solid var(--border)', cursor: 'pointer',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: 'var(--primary)' }}>{item.icon}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>chevron_right</span>
                        </div>
                    ))}
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                        Made with ❤️ by QuickBites Team • © 2026
                    </p>
                </div>
            )
            default: return null
        }
    }

    const panelStyle = {
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        border: '2px solid var(--border)', padding: '1rem 1.25rem',
        marginBottom: '1.5rem', boxShadow: 'var(--shadow-cartoon)',
    }
    const panelHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }

    return (
        <div className="page page-with-nav">
            <div style={{ padding: '2rem 1.25rem' }}>
                {/* Profile Header */}
                <div className="animate-slideUp" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '6rem', height: '6rem', borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(244,123,37,0.3)',
                        border: '4px solid white', fontSize: '2.5rem',
                    }}>{user.name?.[0]?.toUpperCase() || '🍔'}</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
                    {user.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>📱 {user.phone}</p>}
                    <button onClick={openEditModal} style={{
                        marginTop: '0.75rem', background: 'rgba(244,123,37,0.1)', color: 'var(--primary)',
                        padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.875rem',
                    }} id="edit-profile-btn">Edit Profile</button>
                </div>

                {/* Quick Stats */}
                <div className="animate-slideUp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                        { n: String(totalOrders), l: 'Orders', e: '🛒', action: () => navigate('/orders') },
                        { n: String(totalFavorites), l: 'Favorites', e: '❤️', action: () => navigate('/search') },
                        { n: `$${totalSaved.toFixed(0)}`, l: 'Saved', e: '💰', action: null },
                    ].map(s => (
                        <div key={s.l} onClick={s.action} style={{
                            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                            border: '2px solid var(--border)', padding: '1rem', textAlign: 'center',
                            boxShadow: 'var(--shadow-cartoon)', cursor: s.action ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>{s.e}</span>
                            <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{s.n}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 600 }}>{s.l}</p>
                        </div>
                    ))}
                </div>

                {/* Active Panel */}
                {renderPanel()}

                {/* Settings List */}
                <div style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
                    border: '2px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-cartoon)',
                }}>
                    {settings.map((item, i) => (
                        <div key={item.label} className="settings-item"
                            onClick={() => handleSettingClick(item)}
                            style={{
                                borderBottom: i < settings.length - 1 ? '1px solid var(--border)' : 'none',
                                cursor: 'pointer',
                                background: activePanel === item.panel ? 'rgba(244,123,37,0.04)' : 'transparent',
                            }}
                            id={`setting-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className="icon-wrapper" style={{ background: item.bg }}>
                                <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                            </div>
                            <span className="settings-label">{item.label}</span>
                            <span className="material-symbols-outlined chevron" style={{
                                transform: activePanel === item.panel ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}>chevron_right</span>
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <button onClick={handleLogout} style={{
                    width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-lg)',
                    border: '2px solid #fecaca', background: '#fef2f2', color: 'var(--danger)',
                    fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '0.5rem',
                }} id="logout-btn">
                    <span className="material-symbols-outlined">logout</span> Log Out
                </button>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', padding: '1.5rem',
                }} onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false) }}>
                    <div className="animate-bounceIn" style={{
                        background: 'var(--bg-light)', borderRadius: 'var(--radius-xl)',
                        padding: '2rem 1.5rem', width: '100%', maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }}>
                        <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>Edit Profile ✏️</h2>
                        {editError && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>{editError}</div>}
                        {editSuccess && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>✅ Profile updated successfully!</div>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Name</label>
                                <div className="input-group"><span className="material-symbols-outlined icon">person</span>
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" id="edit-name-input" /></div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Phone</label>
                                <div className="input-group"><span className="material-symbols-outlined icon">phone</span>
                                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone number (optional)" id="edit-phone-input" /></div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Email</label>
                                <div className="input-group" style={{ opacity: 0.6 }}><span className="material-symbols-outlined icon">mail</span>
                                    <input type="email" value={user.email} disabled style={{ cursor: 'not-allowed' }} /></div>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Email cannot be changed</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', fontWeight: 700, fontSize: '0.9rem', background: 'var(--surface)' }} id="edit-cancel-btn">Cancel</button>
                            <button onClick={handleSaveProfile} className="btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-md)' }} disabled={editLoading} id="edit-save-btn">{editLoading ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    )
}
