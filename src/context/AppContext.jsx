import { createContext, useContext, useReducer } from 'react'
import { promoCodes } from '../data/restaurants'

const AppContext = createContext()

const initialState = {
    cart: [],
    favorites: ['pizza-palace'], // pre-set one favorite like in design
    promoCode: '',
    promoDiscount: null,
    currentOrder: null,
    orderHistory: [
        {
            id: '#4829',
            restaurant: 'Burger Buddy',
            items: '2x Cheese Burger, 1x Fries',
            total: 24.98,
            status: 'in-progress',
            date: 'Today, 12:30 PM',
        },
        {
            id: '#4815',
            restaurant: 'Pizza Palace',
            items: '1x Margherita, 1x Garlic Bread',
            total: 20.98,
            status: 'delivered',
            date: 'Yesterday, 7:45 PM',
        },
        {
            id: '#4801',
            restaurant: 'Sushi Sam',
            items: '1x Rainbow Roll, 1x Edamame',
            total: 23.98,
            status: 'delivered',
            date: 'Feb 23, 6:00 PM',
        },
    ],
    user: {
        name: 'Foodie Friend',
        email: 'foodie@quickbites.com',
        avatar: null,
    },
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.cart.find(item => item.id === action.payload.id)
            if (existing) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                }
            }
            return {
                ...state,
                cart: [...state.cart, { ...action.payload, quantity: 1 }],
            }
        }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
            }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload
            if (quantity <= 0) {
                return { ...state, cart: state.cart.filter(item => item.id !== id) }
            }
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === id ? { ...item, quantity } : item
                ),
            }
        }

        case 'CLEAR_CART':
            return { ...state, cart: [], promoCode: '', promoDiscount: null }

        case 'TOGGLE_FAVORITE': {
            const id = action.payload
            const isFav = state.favorites.includes(id)
            return {
                ...state,
                favorites: isFav
                    ? state.favorites.filter(f => f !== id)
                    : [...state.favorites, id],
            }
        }

        case 'APPLY_PROMO': {
            const code = action.payload.toUpperCase()
            const promo = promoCodes[code]
            if (!promo) return { ...state, promoCode: '', promoDiscount: null }
            return { ...state, promoCode: code, promoDiscount: promo }
        }

        case 'CLEAR_PROMO':
            return { ...state, promoCode: '', promoDiscount: null }

        case 'PLACE_ORDER': {
            const newOrder = {
                id: `#${4830 + state.orderHistory.length}`,
                restaurant: action.payload.restaurant,
                items: action.payload.items,
                total: action.payload.total,
                status: 'in-progress',
                date: 'Just now',
            }
            return {
                ...state,
                cart: [],
                promoCode: '',
                promoDiscount: null,
                currentOrder: newOrder,
                orderHistory: [newOrder, ...state.orderHistory],
            }
        }

        case 'SET_USER':
            return { ...state, user: { ...state.user, ...action.payload } }

        default:
            return state
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item })
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    const clearCart = () => dispatch({ type: 'CLEAR_CART' })
    const toggleFavorite = (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
    const applyPromo = (code) => dispatch({ type: 'APPLY_PROMO', payload: code })
    const clearPromo = () => dispatch({ type: 'CLEAR_PROMO' })
    const placeOrder = (orderData) => dispatch({ type: 'PLACE_ORDER', payload: orderData })

    const cartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)

    const value = {
        ...state,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        applyPromo,
        clearPromo,
        placeOrder,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
