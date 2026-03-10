import { createContext, useContext, useReducer, useCallback } from 'react'

const promoCodes = {
    YUMMY20: { code: 'YUMMY20', discount: 0.20, label: '20% Off', minOrder: 15 },
    QUICK10: { code: 'QUICK10', discount: 0.10, label: '10% Off', minOrder: 10 },
    FIRST50: { code: 'FIRST50', discount: 0.50, label: '50% Off (First Order!)', minOrder: 0, maxDiscount: 15 },
    FREESHIP: { code: 'FREESHIP', discount: 0, label: 'Free Delivery', freeDelivery: true, minOrder: 20 },
}

// Mock restaurant data so the app works without a backend
const mockRestaurants = [
    {
        id: 'pizza-palace', _id: 'pizza-palace',
        name: 'Pizza Palace', cuisine: 'Italian · Pizza',
        category: 'pizza', rating: 4.8, ratingCount: 234,
        deliveryTime: '20-30', deliveryFee: 'Free', deliveryFeeAmount: 0,
        priceRange: '$$', ecoFriendly: true,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
        menuCategories: ['Popular', 'Pizza', 'Sides', 'Drinks'],
        menu: [
            { id: 'pp-1', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & basil', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'pp-2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni & cheese', price: 14.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'pp-3', name: 'Garlic Bread', description: 'Crispy garlic butter bread', price: 5.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200&h=200&fit=crop', category: 'Sides' },
            { id: 'pp-4', name: 'BBQ Chicken Pizza', description: 'Smoky BBQ chicken with onions', price: 15.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', category: 'Pizza' },
        ],
    },
    {
        id: 'burger-buddy', _id: 'burger-buddy',
        name: 'Burger Buddy', cuisine: 'American · Burgers',
        category: 'burger', rating: 4.6, ratingCount: 189,
        deliveryTime: '15-25', deliveryFee: '$2.99', deliveryFeeAmount: 2.99,
        priceRange: '$', ecoFriendly: false,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
        menuCategories: ['Popular', 'Burgers', 'Sides', 'Drinks'],
        menu: [
            { id: 'bb-1', name: 'Cheese Burger', description: 'Juicy beef patty with melted cheese', price: 9.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'bb-2', name: 'Double Stack', description: 'Two patties, double cheese, special sauce', price: 13.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'bb-3', name: 'Crispy Fries', description: 'Golden crispy french fries', price: 4.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop', category: 'Sides' },
            { id: 'bb-4', name: 'Chicken Burger', description: 'Crispy chicken fillet with lettuce', price: 10.99, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&h=200&fit=crop', category: 'Burgers' },
        ],
    },
    {
        id: 'sushi-sam', _id: 'sushi-sam',
        name: 'Sushi Sam', cuisine: 'Japanese · Sushi',
        category: 'sushi', rating: 4.9, ratingCount: 312,
        deliveryTime: '25-35', deliveryFee: '$1.99', deliveryFeeAmount: 1.99,
        priceRange: '$$$', ecoFriendly: true,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop',
        menuCategories: ['Popular', 'Rolls', 'Nigiri', 'Sides'],
        menu: [
            { id: 'ss-1', name: 'Rainbow Roll', description: 'Assorted fish over California roll', price: 16.99, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'ss-2', name: 'Salmon Nigiri', description: 'Fresh salmon over pressed rice', price: 8.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop', category: 'Nigiri' },
            { id: 'ss-3', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, image: 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=200&h=200&fit=crop', category: 'Sides' },
        ],
    },
    {
        id: 'taco-town', _id: 'taco-town',
        name: 'Taco Town', cuisine: 'Mexican · Tacos',
        category: 'taco', rating: 4.5, ratingCount: 156,
        deliveryTime: '15-20', deliveryFee: 'Free', deliveryFeeAmount: 0,
        priceRange: '$', ecoFriendly: false,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
        menuCategories: ['Popular', 'Tacos', 'Burritos', 'Drinks'],
        menu: [
            { id: 'tt-1', name: 'Beef Taco', description: 'Seasoned beef with fresh toppings', price: 4.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'tt-2', name: 'Chicken Burrito', description: 'Loaded chicken burrito with guac', price: 11.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop', category: 'Burritos' },
        ],
    },
    {
        id: 'green-bowl', _id: 'green-bowl',
        name: 'Green Bowl', cuisine: 'Healthy · Salads',
        category: 'healthy', rating: 4.7, ratingCount: 201,
        deliveryTime: '20-30', deliveryFee: '$1.49', deliveryFeeAmount: 1.49,
        priceRange: '$$', ecoFriendly: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
        menuCategories: ['Popular', 'Bowls', 'Smoothies'],
        menu: [
            { id: 'gb-1', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado, chickpeas & tahini', price: 13.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', category: 'Popular' },
            { id: 'gb-2', name: 'Berry Smoothie', description: 'Mixed berries, banana & yogurt', price: 7.99, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&h=200&fit=crop', category: 'Smoothies' },
        ],
    },
]

const mockCategories = [
    { id: 'pizza', category: 'pizza', label: 'Pizza', emoji: '🍕', count: 1 },
    { id: 'burger', category: 'burger', label: 'Burger', emoji: '🍔', count: 1 },
    { id: 'sushi', category: 'sushi', label: 'Sushi', emoji: '🍣', count: 1 },
    { id: 'taco', category: 'taco', label: 'Taco', emoji: '🌮', count: 1 },
    { id: 'healthy', category: 'healthy', label: 'Healthy', emoji: '🥗', count: 1 },
]

const AppContext = createContext()

const initialState = {
    cart: [],
    favorites: ['pizza-palace'],
    promoCode: '',
    promoDiscount: null,
    currentOrder: null,
    isAuthenticated: false,
    loading: false,
    loadingRestaurants: false,
    restaurants: mockRestaurants,
    categories: mockCategories,
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
            return { ...state, user: { ...state.user, ...action.payload }, isAuthenticated: true }

        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, cart: [], favorites: [] }

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

    // Mock login — works without backend
    const login = useCallback(async (credentials) => {
        dispatch({ type: 'SET_USER', payload: { email: credentials.email, name: 'Foodie Friend' } })
        return { data: { user: { email: credentials.email, name: 'Foodie Friend' } } }
    }, [])

    const register = useCallback(async (userData) => {
        dispatch({ type: 'SET_USER', payload: { email: userData.email, name: userData.name || 'New Foodie' } })
        return { data: { user: { email: userData.email, name: userData.name || 'New Foodie' } } }
    }, [])

    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' })
    }, [])

    // These are no-ops because data is already in state as mock data
    const loadRestaurants = useCallback(async () => {
        return state.restaurants
    }, [state.restaurants])

    const loadCategories = useCallback(async () => {
        return state.categories
    }, [state.categories])

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
        login,
        register,
        logout,
        loadRestaurants,
        loadCategories,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
