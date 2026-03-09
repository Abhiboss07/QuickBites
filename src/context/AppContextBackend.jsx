import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI, cartAPI, ordersAPI, restaurantsAPI } from '../services/api'

const AppContext = createContext()

const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  loading: true,
  
  // Cart state
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  
  // App state
  favorites: [],
  promoCode: '',
  promoDiscount: null,
  currentOrder: null,
  orderHistory: [],
  
  // UI state
  restaurants: [],
  categories: [],
  loadingRestaurants: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      }

    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        cart: [],
        cartCount: 0,
        cartTotal: 0,
        favorites: [],
        currentOrder: null,
        orderHistory: []
      }

    case 'SET_RESTAURANTS':
      return { ...state, restaurants: action.payload }

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }

    case 'LOADING_RESTAURANTS':
      return { ...state, loadingRestaurants: action.payload }

    case 'SET_CART':
      const cart = action.payload.items || []
      const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return { 
        ...state, 
        cart: action.payload,
        cartCount,
        cartTotal,
        promoCode: action.payload.promoCode || '',
        promoDiscount: action.payload.promoDiscount || null
      }

    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item._id !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter(item => item._id !== id) }
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item._id === id ? { ...item, quantity } : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { 
        ...state, 
        cart: [], 
        promoCode: '', 
        promoDiscount: null,
        cartCount: 0,
        cartTotal: 0
      }

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

    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload }

    case 'APPLY_PROMO':
      return { 
        ...state, 
        promoCode: action.payload.promoCode, 
        promoDiscount: action.payload.promoDiscount 
      }

    case 'CLEAR_PROMO':
      return { ...state, promoCode: '', promoDiscount: null }

    case 'PLACE_ORDER':
      const newOrder = action.payload
      return {
        ...state,
        cart: [],
        promoCode: '',
        promoDiscount: null,
        currentOrder: newOrder,
        orderHistory: [newOrder, ...state.orderHistory],
        cartCount: 0,
        cartTotal: 0
      }

    case 'SET_ORDER_HISTORY':
      return { ...state, orderHistory: action.payload }

    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Initialize app - check authentication and load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Initializing app with token:', token ? 'present' : 'none')
        
        if (token) {
          // Verify token and get user data
          const userData = await authAPI.getProfile()
          console.log('User data loaded:', userData.data.user)
          dispatch({ type: 'SET_USER', payload: userData.data.user })
          
          // Load user's cart
          try {
            const cartData = await cartAPI.get()
            console.log('Cart data loaded:', cartData.data.cart)
            dispatch({ type: 'SET_CART', payload: cartData.data.cart })
          } catch (error) {
            console.log('No existing cart found:', error.message)
          }

          // Load user's favorites
          try {
            const favoritesData = await restaurantsAPI.getFeatured() // Using featured as fallback
            console.log('Favorites loaded:', favoritesData.data.restaurants)
            dispatch({ type: 'SET_FAVORITES', payload: favoritesData.data.restaurants.map(r => r._id) })
          } catch (error) {
            console.log('Could not load favorites:', error.message)
          }

          // Load order history
          try {
            const ordersData = await ordersAPI.getAll()
            console.log('Order history loaded:', ordersData.data.orders)
            dispatch({ type: 'SET_ORDER_HISTORY', payload: ordersData.data.orders })
          } catch (error) {
            console.log('Could not load order history:', error.message)
          }
        }
      } catch (error) {
        console.error('Initialization error:', error)
        localStorage.removeItem('token')
        dispatch({ type: 'SET_LOADING', payload: false })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeApp()
  }, [])

  // Auth actions
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      dispatch({ type: 'SET_USER', payload: response.data.user })
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      dispatch({ type: 'SET_USER', payload: response.data.user })
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authAPI.logout()
    dispatch({ type: 'LOGOUT' })
  }

  // Restaurant actions
  const loadRestaurants = async (params = {}) => {
    try {
      dispatch({ type: 'LOADING_RESTAURANTS', payload: true })
      const response = await restaurantsAPI.getAll(params)
      dispatch({ type: 'SET_RESTAURANTS', payload: response.data.restaurants })
      return response.data.restaurants
    } catch (error) {
      console.error('Error loading restaurants:', error)
      throw error
    } finally {
      dispatch({ type: 'LOADING_RESTAURANTS', payload: false })
    }
  }

  const loadCategories = async () => {
    try {
      const response = await restaurantsAPI.getCategories()
      dispatch({ type: 'SET_CATEGORIES', payload: response.data.categories })
      return response.data.categories
    } catch (error) {
      console.error('Error loading categories:', error)
      throw error
    }
  }

  // Cart actions
  const loadCart = async () => {
    try {
      const response = await cartAPI.get()
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      return response.data.cart
    } catch (error) {
      console.error('Error loading cart:', error)
      throw error
    }
  }

  const addToCart = async (item) => {
    try {
      const response = await cartAPI.add(item)
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      return response.data.cart
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.remove(itemId)
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      return response.data.cart
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await cartAPI.update(itemId, quantity)
      dispatch({ type: 'SET_CART', payload: response.data.cart })
      return response.data.cart
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      const response = await cartAPI.clear()
      dispatch({ type: 'CLEAR_CART' })
      return response.data.cart
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const applyPromo = async (code) => {
    try {
      const response = await cartAPI.applyPromo(code)
      dispatch({ type: 'APPLY_PROMO', payload: response.data })
      return response.data
    } catch (error) {
      console.error('Error applying promo:', error)
      throw error
    }
  }

  // Order actions
  const placeOrder = async (orderData) => {
    try {
      const response = await ordersAPI.create(orderData)
      dispatch({ type: 'PLACE_ORDER', payload: response.data.order })
      return response.data.order
    } catch (error) {
      console.error('Error placing order:', error)
      throw error
    }
  }

  const loadOrderHistory = async () => {
    try {
      const response = await ordersAPI.getAll()
      dispatch({ type: 'SET_ORDER_HISTORY', payload: response.data.orders })
      return response.data.orders
    } catch (error) {
      console.error('Error loading order history:', error)
      throw error
    }
  }

  const trackOrder = async (orderNumber) => {
    try {
      const response = await ordersAPI.track(orderNumber)
      dispatch({ type: 'SET_CURRENT_ORDER', payload: response.data.tracking })
      return response.data.tracking
    } catch (error) {
      console.error('Error tracking order:', error)
      throw error
    }
  }

  const toggleFavorite = async (restaurantId) => {
    try {
      await restaurantsAPI.toggleFavorite(restaurantId)
      dispatch({ type: 'TOGGLE_FAVORITE', payload: restaurantId })
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  const value = {
    ...state,
    
    // Auth
    login,
    register,
    logout,
    
    // Restaurants
    loadRestaurants,
    loadCategories,
    
    // Cart
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    
    // Orders
    placeOrder,
    loadOrderHistory,
    trackOrder,
    
    // Favorites
    toggleFavorite,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
