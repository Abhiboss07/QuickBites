import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

export default function Orders() {
    const navigate = useNavigate()
    const { orderHistory } = useApp()

    return (
        <div className="page page-with-nav">
            <div style={{ padding: '2rem 1.25rem 1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders 📋</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orderHistory.map((order, i) => (
                        <div key={order.id} className="order-card animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{order.restaurant}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Order {order.id} • {order.date}</p>
                                </div>
                                <span className={`order-status ${order.status}`}>
                                    {order.status === 'delivered' ? '✅ Delivered' : '🚀 In Progress'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{order.items}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>${order.total.toFixed(2)}</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {order.status === 'in-progress' && (
                                        <button onClick={() => navigate('/tracking')} style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', boxShadow: 'var(--shadow-cartoon)' }} id={`track-${order.id}`}>Track</button>
                                    )}
                                    <button onClick={() => navigate('/home')} style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem' }} id={`reorder-${order.id}`}>Reorder</button>
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
