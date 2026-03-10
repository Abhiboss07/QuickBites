import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MenuItem from '../components/MenuItem'
import BottomNav from '../components/BottomNav'

export default function Restaurant() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { restaurants, cartCount } = useApp()
    const [activeCategory, setActiveCategory] = useState('Popular')
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    const restaurant = restaurants.find(r => r._id === id)

    if (!restaurant) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>😕</span>
                    <p style={{ fontWeight: 700, marginTop: '1rem' }}>Restaurant not found</p>
                    <button className="btn-primary" onClick={() => navigate('/home')} style={{ marginTop: '1rem', maxWidth: '200px' }}>
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    const filteredMenu = restaurant.menu.filter(item => {
        const matchesCategory = activeCategory === 'Popular'
            ? item.category === 'Popular'
            : item.category === activeCategory
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        return (!searchQuery ? matchesCategory : matchesSearch)
    })

    // Show all items if category filter returns empty for non-Popular
    const displayMenu = filteredMenu.length > 0 ? filteredMenu : (searchQuery ? [] : restaurant.menu)

    return (
        <div className="page page-with-nav" style={{ background: '#f8fafc' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.5rem 1.25rem 1rem', position: 'sticky', top: 0, zIndex: 20,
                background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(8px)',
                borderBottom: '2px solid var(--border)',
            }}>
                <button className="btn-icon" onClick={() => navigate(-1)} id="restaurant-back-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{restaurant.name}</h2>
                <button className="btn-icon" onClick={() => setShowSearch(!showSearch)} id="restaurant-search-btn">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>

            {/* Search overlay */}
            {showSearch && (
                <div className="animate-slideDown" style={{ padding: '0 1.25rem 0.75rem', background: 'rgba(248,250,252,0.95)' }}>
                    <div className="input-group">
                        <span className="material-symbols-outlined icon">search</span>
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            id="menu-search-input"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Hero Banner */}
            <div className="animate-fadeIn" style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
                <div style={{
                    position: 'relative', height: '200px', borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden', boxShadow: 'var(--shadow-card)',
                }}>
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white' }}>
                        {restaurant.deliveryFeeAmount === 0 && (
                            <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                                Free Delivery
                            </span>
                        )}
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2 }}>{restaurant.name}</h2>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>{restaurant.cuisine}</p>
                    </div>
                </div>
            </div>

            {/* Info badges */}
            <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1.25rem', marginBottom: '1rem', overflow: 'auto' }} className="hide-scrollbar">
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', background: 'var(--surface)',
                    borderRadius: 'var(--radius-full)', border: '2px solid var(--border)',
                    flexShrink: 0,
                }}>
                    <span style={{ fontWeight: 800 }}>{restaurant.rating}</span>
                    <span className="material-symbols-outlined filled" style={{ color: 'var(--accent)', fontSize: '1rem' }}>star</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{restaurant.ratingCount} ratings</span>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', background: 'var(--surface)',
                    borderRadius: 'var(--radius-full)', border: '2px solid var(--border)',
                    flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>schedule</span>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{restaurant.deliveryTime.split('-')[0]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>min</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivery time</span>
                </div>
                {restaurant.ecoFriendly && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', background: 'var(--surface)',
                        borderRadius: 'var(--radius-full)', border: '2px solid var(--border)',
                        flexShrink: 0,
                    }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--accent-secondary)', fontSize: '1.125rem' }}>eco</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Eco-friendly</span>
                    </div>
                )}
            </div>

            {/* Category filter tabs */}
            <div className="scroll-row" style={{ padding: '0 1.25rem', marginBottom: '1rem', gap: '0.5rem' }}>
                {restaurant.menuCategories.map((cat, i) => (
                    <button
                        key={cat}
                        className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => { setActiveCategory(cat); setSearchQuery('') }}
                        id={`filter-${cat.toLowerCase()}`}
                    >
                        {i === 0 && '🔥 '}{cat}
                    </button>
                ))}
            </div>

            {/* Menu Title */}
            <div style={{ padding: '0 1.25rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    {searchQuery ? 'Search Results' : `${activeCategory} Items`}
                </h3>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '2rem' }}>
                {displayMenu.length > 0 ? (
                    displayMenu.map((item, i) => (
                        <div key={item.id} style={{ animationDelay: `${i * 0.08}s` }}>
                            <MenuItem item={item} restaurantId={restaurant.id} />
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🍽️</span>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.5rem' }}>No items found</p>
                    </div>
                )}
            </div>

            {/* Floating cart button */}
            {cartCount > 0 && (
                <button
                    className="floating-cart"
                    onClick={() => navigate('/cart')}
                    id="floating-cart-btn"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>shopping_bag</span>
                    <span className="count">{cartCount}</span>
                </button>
            )}

            <BottomNav />
        </div>
    )
}
