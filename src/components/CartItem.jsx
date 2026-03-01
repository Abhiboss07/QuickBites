import { useApp } from '../context/AppContext'

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useApp()

    return (
        <div
            className="animate-slideUp"
            style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--border)', padding: '1rem',
                boxShadow: 'var(--shadow-cartoon)',
            }}
            id={`cart-item-${item.id}`}
        >
            {/* Food image */}
            <div style={{
                width: '5rem', height: '5rem', borderRadius: 'var(--radius-md)',
                overflow: 'hidden', flexShrink: 0,
            }}>
                <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.125rem' }}>{item.name}</h4>
                {item.description && (
                    <p className="truncate" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        {item.description}
                    </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="qty-control">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            id={`qty-minus-${item.id}`}
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            id={`qty-plus-${item.id}`}
                        >+</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
