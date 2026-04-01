import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextBackend'
import BottomNav from '../components/BottomNav'

export default function Orders() {
    const navigate = useNavigate()
    const { orderHistory, loadOrderHistory } = useApp()

    useEffect(() => {
        loadOrderHistory().catch(() => {})
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getStatusLabel = (status) => {
        if (status === 'delivered') return '✅ Delivered'
        if (status === 'cancelled') return '❌ Cancelled'
        return '🚀 In Progress'
    }

    const isInProgress = (status) => !['delivered', 'cancelled'].includes(status)

    const formatItems = (items) => {
        if (!Array.isArray(items)) return String(items || '')
        return items.map(i => `${i.quantity}x ${i.name}`).join(', ')
    }

    return (
        <div className="page page-with-nav">
            <div style={{ padding: '2rem 1.25rem 1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders 📋</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orderHistory.map((order, i) => (
                        <div key={order._id || order.orderNumber} className="order-card animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{order.restaurantName || order.restaurant?.name || 'Restaurant'}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        Order {order.orderNumber || order._id} • {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`order-status ${order.status}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                {formatItems(order.items)}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                                    ${(order.totalAmount || order.total || 0).toFixed(2)}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {isInProgress(order.status) && (
                                        <button
                                            onClick={() => navigate('/tracking')}
                                            style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', boxShadow: 'var(--shadow-cartoon)' }}
                                            id={`track-${order._id}`}
                                        >
                                            Track
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/home')}
                                        style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem' }}
                                        id={`reorder-${order._id}`}
                                    >
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {orderHistory.length === 0 && (
                    <div className="animate-bounceIn" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📦</span>
                        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start ordering delicious food!</p>
                        <button className="btn-primary" onClick={() => navigate('/home')} style={{ maxWidth: '200px', margin: '0 auto' }}>Browse Restaurants</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
