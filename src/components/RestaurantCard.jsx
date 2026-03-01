import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function RestaurantCard({ restaurant, style }) {
    const navigate = useNavigate()
    const { favorites, toggleFavorite } = useApp()
    const isFav = favorites.includes(restaurant.id)

    return (
        <div
            className="card animate-slideUp"
            style={{ cursor: 'pointer', ...style }}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            id={`restaurant-card-${restaurant.id}`}
        >
            <div style={{ position: 'relative', height: '12rem', width: '100%', overflow: 'hidden' }}>
                {/* Delivery time badge */}
                <div style={{
                    position: 'absolute', top: '0.75rem', left: '0.75rem',
                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                    padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                    zIndex: 10, boxShadow: 'var(--shadow-soft)',
                }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{restaurant.deliveryTime}</span>
                </div>

                {/* Favorite button */}
                <button
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(restaurant.id) }}
                    id={`fav-btn-${restaurant.id}`}
                >
                    <span className="material-symbols-outlined">favorite</span>
                </button>

                {/* Image */}
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `url(${restaurant.image})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transition: 'transform 0.7s ease',
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>

            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{restaurant.name}</h3>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        background: 'rgba(255,205,60,0.2)', padding: '0.125rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <span className="material-symbols-outlined filled" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>star</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{restaurant.rating}</span>
                    </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
                    {restaurant.cuisine}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: restaurant.deliveryFeeAmount === 0 ? 'var(--primary)' : 'inherit' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>local_shipping</span>
                        <span>{restaurant.deliveryFee}</span>
                    </div>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>attach_money</span>
                        <span>{restaurant.priceRange}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
