import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

export default function Tracking() {
    const navigate = useNavigate()
    const { currentOrder, orderHistory } = useApp()
    const [progress, setProgress] = useState(20)
    const [stage, setStage] = useState('cooking')
    const order = currentOrder || orderHistory[0]

    useEffect(() => {
        const stages = [
            { p: 30, s: 'cooking', d: 1000 },
            { p: 50, s: 'cooking', d: 3000 },
            { p: 65, s: 'delivering', d: 5000 },
            { p: 75, s: 'delivering', d: 7000 },
            { p: 85, s: 'delivering', d: 10000 },
            { p: 100, s: 'arrived', d: 15000 },
        ]
        const timers = stages.map(({ p, s, d }) => setTimeout(() => { setProgress(p); setStage(s) }, d))
        return () => timers.forEach(clearTimeout)
    }, [])

    const statusLabel = stage === 'cooking' ? 'Preparing' : stage === 'delivering' ? 'In Transit' : 'Arrived!'
    const timeLabel = stage === 'cooking' ? '~10 min' : stage === 'delivering' ? '3 mins away' : 'Enjoy! 🎉'

    return (
        <div className="page page-with-nav">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.25rem 1rem', position: 'sticky', top: 0, zIndex: 20, background: 'rgba(254,250,246,0.95)', backdropFilter: 'blur(8px)' }}>
                <button className="btn-icon" onClick={() => navigate('/home')} id="tracking-back-btn"><span className="material-symbols-outlined">arrow_back</span></button>
                <h2 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Track Order {order?.id || '#4829'}</h2>
                <button style={{ background: 'rgba(244,123,37,0.1)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }} id="help-btn">Help</button>
            </div>

            <div className="cartoon-map" style={{ height: '45vh', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '25%', left: '25%', width: '8rem', height: '8rem', background: 'rgba(134,239,172,0.3)', borderRadius: '50%', filter: 'blur(30px)' }} />
                <div style={{ position: 'absolute', bottom: '33%', right: '25%', width: '10rem', height: '10rem', background: 'rgba(147,197,253,0.3)', borderRadius: '50%', filter: 'blur(30px)' }} />
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6, pointerEvents: 'none' }}>
                    <path d="M-10 100 C 50 100, 100 150, 150 150 S 250 100, 300 200 S 350 300, 400 350" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="20" />
                    <path d="M-10 100 C 50 100, 100 150, 150 150 S 250 100, 300 200 S 350 300, 400 350" fill="none" stroke="#e2e8f0" strokeDasharray="20 10" strokeLinecap="round" strokeWidth="14" />
                </svg>
                <div style={{ position: 'absolute', top: '38%', left: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)', zIndex: 20, animation: 'scooterRide 2s ease-in-out infinite' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 15px rgba(244,123,37,0.4)', border: '2px solid white', animation: 'bounce 1s infinite' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>moped</span>
                    </div>
                    <div style={{ background: 'var(--surface)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', marginTop: '0.5rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', display: 'block' }}>{statusLabel}</span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{timeLabel}</span>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '20%', right: '15%', zIndex: 10 }}>
                    <div style={{ background: 'var(--text-primary)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>home</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, marginTop: '-2rem', position: 'relative', zIndex: 30, background: 'var(--bg-light)', borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', padding: '2rem 1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'absolute', top: '0.75rem', left: '50%', transform: 'translateX(-50%)', width: '3rem', height: '0.375rem', background: '#e2e8f0', borderRadius: 'var(--radius-full)' }} />
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{stage === 'arrived' ? '🎉 Enjoy your meal!' : "Yum! It's on the way!"}</h2>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>schedule</span>
                        {stage === 'arrived' ? 'Delivered!' : 'Arrival 12:45 PM'}
                    </p>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', padding: '0 0.25rem' }}>
                        <span style={{ color: progress >= 30 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Cooking</span>
                        <span style={{ color: stage === 'delivering' ? 'var(--primary)' : 'var(--text-muted)', animation: stage === 'delivering' ? 'pulse 2s infinite' : 'none' }}>Delivering...</span>
                        <span style={{ color: stage === 'arrived' ? 'var(--primary)' : 'var(--text-muted)' }}>Eat</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                        <div className="progress-indicator" style={{ left: `${progress}%` }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>local_pizza</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #fde68a, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem', fontWeight: 800, border: '2px solid white', boxShadow: 'var(--shadow-soft)' }}>B</div>
                        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--success)', color: 'white', fontSize: '0.5625rem', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)', border: '2px solid white' }}>4.9★</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 700 }}>Ben is your rider</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Riding a Speedy Scooter</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }} id="chat-driver-btn"><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chat</span></button>
                        <button style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(244,123,37,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }} id="call-driver-btn"><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>call</span></button>
                    </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate('/orders')} id="view-order-detail">
                        <div>
                            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Order Detail</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{order?.items || '2x Cheese Burger, 1x Fries...'}</span>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
