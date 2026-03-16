import { useApp } from '../context/AppContextBackend'

export default function MenuItem({ item, restaurantId }) {
    const { addToCart, cart } = useApp()
    const inCart = cart.find(c => c.menuItem?.toString() === item._id?.toString())

    const handleAdd = () => {
        addToCart({
            menuItem: item._id,
            restaurant: restaurantId,
            quantity: 1,
            price: item.price,
            name: item.name,
            image: item.image,
        })
    }

    return (
        <div
            className="animate-slideUp"
            style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--border)', padding: '0.75rem',
                boxShadow: 'var(--shadow-cartoon)', transition: 'all 0.3s ease',
            }}
            id={`menu-item-${item._id}`}
        >
            {/* Food image */}
            <div style={{
                width: '5rem', height: '5rem', borderRadius: 'var(--radius-md)',
                overflow: 'hidden', flexShrink: 0, position: 'relative',
            }}>
                <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {item.spicy && (
                    <div style={{
                        position: 'absolute', top: '0.25rem', left: '0.25rem',
                        background: 'var(--danger)', color: 'white',
                        fontSize: '0.5rem', fontWeight: 800, padding: '0.125rem 0.375rem',
                        borderRadius: 'var(--radius-sm)', textTransform: 'uppercase',
                    }}>
                        SPICY
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                <p className="line-clamp-2" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {item.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                        ${item.price.toFixed(2)}
                    </span>
                    {inCart && (
                        <span style={{ fontSize: '0.625rem', color: 'var(--success)', fontWeight: 700 }}>
                            {inCart.quantity} in cart
                        </span>
                    )}
                </div>
            </div>

            {/* Add button */}
            <button className="add-btn" onClick={handleAdd} id={`add-btn-${item._id}`}>
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    )
}
