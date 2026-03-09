import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextBackend'
import RestaurantCard from '../components/RestaurantCard'
import BottomNav from '../components/BottomNav'

export default function Home() {
    const navigate = useNavigate()
    const { cartCount, restaurants, categories, loadRestaurants, loadingRestaurants } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)

    // Load restaurants on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                await loadRestaurants()
            } catch (error) {
                console.error('Failed to load restaurants:', error)
            }
        }
        loadData()
    }, [loadRestaurants])

    // Filter restaurants based on search and category
    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = !searchQuery ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || r.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Format categories for display
    const displayCategories = categories.map(cat => ({
        id: cat.category,
        label: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
        emoji: getCategoryEmoji(cat.category),
        color: getCategoryColor(cat.category)
    }))

    // Helper functions
    const getCategoryEmoji = (category) => {
        const emojiMap = {
            pizza: '🍕',
            burger: '🍔',
            taco: '🌮',
            healthy: '🥗',
            donut: '🍩',
            sushi: '🍣',
            noodles: '🍜',
            'ice-cream': '🍦'
        }
        return emojiMap[category] || '🍽️'
    }

    const getCategoryColor = (category) => {
        const colorMap = {
            pizza: '#fff7ed',
            burger: '#fef2f2',
            taco: '#fefce8',
            healthy: '#f0fdf4',
            donut: '#fdf2f8',
            sushi: '#faf5ff',
            noodles: '#fffbeb',
            'ice-cream': '#f0f9ff'
        }
        return colorMap[category] || '#f5f5f5'
    }

    return (
        <div className="page page-with-nav">
            {/* Header */}
            <header style={{
                padding: '2rem 1.25rem 0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 20,
                background: 'rgba(254,250,246,0.95)', backdropFilter: 'blur(8px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'var(--primary)', borderRadius: 'var(--radius-full)',
                        padding: '0.5rem', color: 'white', boxShadow: 'var(--shadow-cartoon)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>lunch_dining</span>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>QuickBites</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Hungry? Let's eat!</p>
                    </div>
                </div>
                <button className="btn-icon" id="notifications-btn" style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>notifications</span>
                    <span style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '8px', height: '8px', background: 'var(--danger)',
                        borderRadius: '50%', border: '2px solid var(--surface)',
                    }} />
                </button>
            </header>

            {/* Search */}
            <div style={{ padding: '1rem 1.25rem' }}>
                <div className="input-group" style={{ height: '3.5rem', boxShadow: 'var(--shadow-cartoon)', overflow: 'hidden', padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>search</span>
                    </div>
                    <input
                        type="text"
                        placeholder="What are you craving?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, padding: '0 0.75rem', fontSize: '1rem', fontWeight: 500, height: '100%' }}
                        id="home-search-input"
                    />
                    <button
                        style={{
                            background: 'var(--primary)', height: '100%', padding: '0 1.25rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        }}
                        id="filter-btn"
                    >
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>
            </div>

            {/* Categories */}
            <section style={{ padding: '0.5rem 0 0.5rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.25rem', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Yummy Categories</h2>
                    <button style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700 }} id="see-all-categories">
                        See All
                    </button>
                </div>
                <div className="scroll-row" style={{ paddingRight: '1.25rem' }}>
                    {displayCategories.map((cat, i) => (
                        <button
                            key={cat.id}
                            className={`category-pill animate-slideUp stagger-${i + 1} ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            id={`category-${cat.id}`}
                        >
                            <div className="emoji-circle" style={{ background: cat.color }}>
                                <span>{cat.emoji}</span>
                            </div>
                            <span className="label">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Restaurants */}
            <section style={{ padding: '0.5rem 1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                        {selectedCategory ? `${displayCategories.find(c => c.id === selectedCategory)?.label || ''} Restaurants` : 'Featured Restaurants'}
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((restaurant, i) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))
                    ) : (
                        <div className="animate-bounceIn" style={{
                            textAlign: 'center', padding: '3rem 1rem',
                            background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
                            border: '2px dashed var(--border)',
                        }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🔍</span>
                            <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No restaurants found</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try a different search or category!</p>
                        </div>
                    )}
                </div>
            </section>

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
