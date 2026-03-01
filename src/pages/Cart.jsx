import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CartItem from '../components/CartItem'

export default function Cart() {
    const navigate = useNavigate()
    const { cart, cartTotal, clearCart, applyPromo, clearPromo, promoCode, promoDiscount, placeOrder } = useApp()
    const [promoInput, setPromoInput] = useState(promoCode || '')
    const [promoError, setPromoError] = useState('')
    const [promoSuccess, setPromoSuccess] = useState(promoCode ? true : false)

    const deliveryFee = cartTotal >= 20 ? 0 : 2.99
    let discountAmount = 0

    if (promoDiscount) {
        if (promoDiscount.freeDelivery) {
            discountAmount = deliveryFee
        } else {
            discountAmount = cartTotal * promoDiscount.discount
            if (promoDiscount.maxDiscount) {
                discountAmount = Math.min(discountAmount, promoDiscount.maxDiscount)
            }
        }
    }

    const total = cartTotal + deliveryFee - discountAmount

    const handleApplyPromo = () => {
        if (!promoInput.trim()) return
        applyPromo(promoInput)
        // Check if promo was valid (a small delay to let state update)
        setTimeout(() => {
            const code = promoInput.toUpperCase()
            const validCodes = ['YUMMY20', 'QUICK10', 'FIRST50', 'FREESHIP']
            if (validCodes.includes(code)) {
                setPromoSuccess(true)
                setPromoError('')
            } else {
                setPromoError('Invalid promo code. Try YUMMY20!')
                setPromoSuccess(false)
                clearPromo()
            }
        }, 100)
    }

    const handlePlaceOrder = () => {
        if (cart.length === 0) return
        const itemsSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ')
        placeOrder({
            restaurant: cart[0]?.restaurantId || 'QuickBites',
            items: itemsSummary,
            total: total,
        })
        navigate('/tracking')
    }

    if (cart.length === 0) {
        return (
            <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="animate-bounceIn" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '5rem', display: 'block', marginBottom: '1rem' }} className="animate-float">🛒</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your cart is empty!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add some yummy items to get started</p>
                    <button className="btn-primary" onClick={() => navigate('/home')} style={{ maxWidth: '250px', margin: '0 auto' }} id="browse-btn">
                        Browse Restaurants
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.5rem 1.25rem 1rem',
                borderBottom: '2px solid var(--border)',
            }}>
                <button className="btn-icon" onClick={() => navigate(-1)} id="cart-back-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Your Feast</h2>
                <button
                    onClick={clearCart}
                    style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}
                    id="clear-cart-btn"
                >
                    Clear
                </button>
            </div>

            {/* Cart Items */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {cart.map((item, i) => (
                    <div key={item.id} className={`stagger-${i + 1}`} style={{ animationFillMode: 'both' }}>
                        <CartItem item={item} />
                    </div>
                ))}

                {/* Promo Code */}
                <div className="promo-box" style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>confirmation_number</span>
                        <span style={{ fontWeight: 700 }}>Have a promo code?</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="input-group" style={{ flex: 1, height: '2.75rem' }}>
                            <input
                                type="text"
                                placeholder="YUMMY20"
                                value={promoInput}
                                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); setPromoSuccess(false) }}
                                style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                id="promo-input"
                            />
                        </div>
                        <button
                            onClick={handleApplyPromo}
                            style={{
                                background: 'var(--text-primary)', color: 'white', padding: '0 1.25rem',
                                borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.875rem',
                                boxShadow: 'var(--shadow-cartoon)', transition: 'all 0.2s',
                            }}
                            id="apply-promo-btn"
                        >
                            Apply
                        </button>
                    </div>
                    {promoError && (
                        <p className="animate-fadeIn" style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>{promoError}</p>
                    )}
                    {promoSuccess && promoDiscount && (
                        <p className="animate-fadeIn" style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>
                            ✅ {promoDiscount.label} applied!
                        </p>
                    )}
                </div>

                {/* Order Summary */}
                <div className="dashed-summary" style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal</span>
                        <span style={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Delivery Fee</span>
                        <span style={{ fontWeight: 700, color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                    </div>
                    {discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Discount</span>
                            <span style={{ fontWeight: 700, color: 'var(--success)' }}>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Place Order Button - Fixed at bottom */}
            <div style={{
                padding: '1rem 1.25rem 2rem',
                borderTop: '2px solid var(--border)',
                background: 'var(--bg-light)',
            }}>
                <button
                    className="btn-primary"
                    onClick={handlePlaceOrder}
                    id="place-order-btn"
                    style={{ borderRadius: 'var(--radius-2xl)' }}
                >
                    <span>Place Order</span>
                    <span style={{ fontSize: '1.25rem' }}>🚀</span>
                </button>
            </div>
        </div>
    )
}
