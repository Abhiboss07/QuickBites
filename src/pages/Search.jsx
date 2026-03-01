import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { restaurants, categories } from '../data/restaurants'
import RestaurantCard from '../components/RestaurantCard'
import BottomNav from '../components/BottomNav'

export default function Search() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState([])

    const toggleFilter = (id) => {
        setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
    }

    const results = restaurants.filter(r => {
        const matchesQuery = !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase())
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(r.category)
        return matchesQuery && matchesFilter
    })

    // Also search menu items
    const menuResults = query ? restaurants.flatMap(r => r.menu.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase())).map(m => ({ ...m, restaurantName: r.name, restaurantId: r.id }))) : []

    return (
        <div className="page page-with-nav">
            <div style={{ padding: '2rem 1.25rem 1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Search 🔍</h1>
                <div className="input-group" style={{ boxShadow: 'var(--shadow-cartoon)' }}>
                    <span className="material-symbols-outlined icon">search</span>
                    <input type="text" placeholder="Search restaurants or dishes..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus id="search-input" />
                    {query && <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined">close</span></button>}
                </div>
            </div>

            <div className="scroll-row" style={{ padding: '0 1.25rem', marginBottom: '1rem', gap: '0.5rem' }}>
                {categories.slice(0, 6).map(cat => (
                    <button key={cat.id} className={`filter-chip ${activeFilters.includes(cat.id) ? 'active' : ''}`} onClick={() => toggleFilter(cat.id)} id={`search-filter-${cat.id}`}>
                        {cat.emoji} {cat.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: '0 1.25rem 1.5rem' }}>
                {menuResults.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Dishes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {menuResults.slice(0, 4).map(item => (
                                <div key={item.id} onClick={() => navigate(`/restaurant/${item.restaurantId}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.name}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.restaurantName}</p>
                                    </div>
                                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{query || activeFilters.length > 0 ? 'Results' : 'All Restaurants'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {results.length > 0 ? results.map(r => <RestaurantCard key={r.id} restaurant={r} />) : (
                        <div className="animate-bounceIn" style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>😕</span>
                            <p style={{ fontWeight: 700 }}>No results found</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try different keywords or filters</p>
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
