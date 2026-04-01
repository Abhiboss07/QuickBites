import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextBackend'
import { paymentsAPI } from '../services/api'
import CartItem from '../components/CartItem'

// Load Razorpay script dynamically
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.id = 'razorpay-script'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default function Cart() {
    const navigate = useNavigate()
    const { cart, cartTotal, clearCart, applyPromo, clearPromo, promoCode, promoDiscount, placeOrder, user } = useApp()
    const [promoInput, setPromoInput] = useState(promoCode || '')
    const [promoError, setPromoError] = useState('')
    const [promoSuccess, setPromoSuccess] = useState(promoCode ? true : false)
    const [orderLoading, setOrderLoading] = useState(false)
    const [orderError, setOrderError] = useState('')
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)
    const [successOrderNumber, setSuccessOrderNumber] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('online') // 'online' or 'cod'

    const deliveryFee = cartTotal >= 20 ? 0 : 2.99
    let discountAmount = 0

    if (promoDiscount) {
        if (promoDiscount.freeDelivery) {
            discountAmount = deliveryFee
        } else {
            discountAmount = cartTotal * (promoDiscount.discount || promoDiscount)
            if (promoDiscount.maxDiscount) {
                discountAmount = Math.min(discountAmount, promoDiscount.maxDiscount)
            }
        }
    }

    const total = cartTotal + deliveryFee - discountAmount

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return
        try {
            await applyPromo(promoInput)
            setPromoSuccess(true)
            setPromoError('')
        } catch (err) {
            setPromoError(err.message || 'Invalid promo code. Try YUMMY20!')
            setPromoSuccess(false)
            clearPromo()
        }
    }

    const finalizeOrder = async (paymentId, paymentMethodUsed) => {
        const restaurantId = cart[0]?.restaurant?._id || cart[0]?.restaurant
        const orderItems = cart.map(item => ({
            menuItem: item.menuItem,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }))
        const deliveryAddress = user?.addresses?.[0] || {
            street: '123 Main St',
            city: 'New York',
            zipCode: '10001',
        }
        const order = await placeOrder({
            restaurant: restaurantId,
            items: orderItems,
            deliveryFee,
            promoDiscount: promoDiscount?.discount || 0,
            deliveryAddress,
            paymentId,
            paymentMethod: paymentMethodUsed,
        })
        setSuccessOrderNumber(order?.orderNumber || '#5001')
        setShowSuccessPopup(true)
    }

    const handleRazorpayPayment = async () => {
        setOrderLoading(true)
        setOrderError('')

        try {
            // Load Razorpay SDK
            const loaded = await loadRazorpayScript()
            if (!loaded) {
                // Fallback to COD if script fails
                await finalizeOrder(`cod_${Date.now()}`, 'cod')
                setOrderLoading(false)
                return
            }

            // Create Razorpay order on backend
            const response = await paymentsAPI.createOrder(total)
            const { orderId, amount, currency, keyId, codFallback } = response.data

            // If Razorpay keys not configured, process as COD
            if (codFallback || !keyId || keyId === 'rzp_test_placeholder' || keyId === 'rzp_test_YOUR_KEY_ID') {
                await finalizeOrder(`cod_${Date.now()}`, 'cod')
                setOrderLoading(false)
                return
            }

            // Open Razorpay Checkout
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'QuickBites',
                description: `Order for ${cart.length} item(s)`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyRes = await paymentsAPI.verify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                        if (verifyRes.data.verified) {
                            await finalizeOrder(response.razorpay_payment_id, 'razorpay')
                        }
                    } catch (err) {
                        setOrderError('Payment verification failed. Please contact support.')
                    }
                    setOrderLoading(false)
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || '',
                },
                theme: {
                    color: '#f47b25',
                },
                modal: {
                    ondismiss: function () {
                        setOrderLoading(false)
                    },
                },
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
        } catch (err) {
            // On any error, fallback to COD
            try {
                await finalizeOrder(`cod_${Date.now()}`, 'cod')
            } catch (orderErr) {
                setOrderError(orderErr.message || 'Failed to place order')
            }
            setOrderLoading(false)
        }
    }

    const handleCODOrder = async () => {
        setOrderLoading(true)
        setOrderError('')
        try {
            await finalizeOrder(`cod_${Date.now()}`, 'cod')
        } catch (err) {
            setOrderError(err.message || 'Failed to place order. Please try again.')
        } finally {
            setOrderLoading(false)
        }
    }

    const handlePlaceOrder = () => {
        if (cart.length === 0) return
        if (paymentMethod === 'online') {
            handleRazorpayPayment()
        } else {
            handleCODOrder()
        }
    }

    const handleSuccessClose = () => {
        setShowSuccessPopup(false)
        navigate('/tracking')
    }

    if (cart.length === 0 && !showSuccessPopup) {
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
                    <div key={item._id} className={`stagger-${i + 1}`} style={{ animationFillMode: 'both' }}>
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
                                type="text" placeholder="YUMMY20" value={promoInput}
                                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); setPromoSuccess(false) }}
                                style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                id="promo-input"
                            />
                        </div>
                        <button onClick={handleApplyPromo} style={{
                            background: 'var(--text-primary)', color: 'white', padding: '0 1.25rem',
                            borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.875rem',
                            boxShadow: 'var(--shadow-cartoon)',
                        }} id="apply-promo-btn">Apply</button>
                    </div>
                    {promoError && <p className="animate-fadeIn" style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>{promoError}</p>}
                    {promoSuccess && promoDiscount && <p className="animate-fadeIn" style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>✅ Promo code applied!</p>}
                </div>

                {/* Payment Method Selection */}
                <div style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border)', padding: '1rem',
                    boxShadow: 'var(--shadow-cartoon)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>payments</span>
                        <span style={{ fontWeight: 700 }}>Payment Method</span>
                    </div>

                    {/* Online Payment */}
                    <div
                        onClick={() => setPaymentMethod('online')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            background: paymentMethod === 'online' ? 'rgba(244,123,37,0.08)' : 'transparent',
                            border: paymentMethod === 'online' ? '2px solid var(--primary)' : '2px solid transparent',
                            transition: 'all 0.2s', marginBottom: '0.5rem',
                        }}
                        id="payment-online"
                    >
                        <div style={{
                            width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                            border: paymentMethod === 'online' ? '5px solid var(--primary)' : '2px solid #cbd5e1',
                            transition: 'all 0.2s',
                        }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pay Online</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Razorpay • UPI • Cards • Wallets</p>
                        </div>
                        <span style={{ fontSize: '1.25rem' }}>💳</span>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                        onClick={() => setPaymentMethod('cod')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            background: paymentMethod === 'cod' ? 'rgba(16,185,129,0.08)' : 'transparent',
                            border: paymentMethod === 'cod' ? '2px solid var(--success)' : '2px solid transparent',
                            transition: 'all 0.2s',
                        }}
                        id="payment-cod"
                    >
                        <div style={{
                            width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                            border: paymentMethod === 'cod' ? '5px solid var(--success)' : '2px solid #cbd5e1',
                            transition: 'all 0.2s',
                        }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cash on Delivery</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pay when food arrives</p>
                        </div>
                        <span style={{ fontSize: '1.25rem' }}>💵</span>
                    </div>
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

                {orderError && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>{orderError}</p>}
            </div>

            {/* Place Order Button */}
            <div style={{ padding: '1rem 1.25rem 2rem', borderTop: '2px solid var(--border)', background: 'var(--bg-light)' }}>
                <button className="btn-primary" onClick={handlePlaceOrder} id="place-order-btn"
                    style={{ borderRadius: 'var(--radius-2xl)' }} disabled={orderLoading}>
                    <span>{orderLoading ? 'Processing...' : paymentMethod === 'online' ? 'Pay & Order' : 'Place Order (COD)'}</span>
                    <span style={{ fontSize: '1.25rem' }}>{orderLoading ? '⏳' : paymentMethod === 'online' ? '💳' : '🚀'}</span>
                </button>
            </div>

            {/* Order Success Popup */}
            {showSuccessPopup && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
                }}>
                    <div className="animate-bounceIn" style={{
                        background: 'var(--bg-light)', borderRadius: 'var(--radius-2xl)',
                        padding: '2.5rem 2rem', width: '100%', maxWidth: '360px',
                        textAlign: 'center', boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
                    }}>
                        <div style={{
                            width: '5rem', height: '5rem', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            boxShadow: '0 8px 30px rgba(16,185,129,0.4)',
                            animation: 'pulse 1.5s infinite',
                        }}>
                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2.5rem' }}>check_circle</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed! 🎉</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                            Your order has been successfully created!
                        </p>
                        <p style={{
                            background: 'rgba(244,123,37,0.1)', color: 'var(--primary)',
                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                            fontWeight: 800, fontSize: '1.125rem', display: 'inline-block', marginBottom: '1.25rem',
                        }}>Order {successOrderNumber}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                            Your delicious food is being prepared! 🍕
                        </p>
                        <button className="btn-primary" onClick={handleSuccessClose}
                            style={{ width: '100%', borderRadius: 'var(--radius-xl)' }} id="track-order-btn">
                            <span>Track My Order</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>local_shipping</span>
                        </button>
                        <button onClick={() => { setShowSuccessPopup(false); navigate('/home') }}
                            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'transparent' }}
                            id="continue-shopping-btn">Continue Browsing</button>
                    </div>
                </div>
            )}
        </div>
    )
}
