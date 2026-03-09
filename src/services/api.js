const API_BASE_URL = '/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔄 API Request: ${options.method || 'GET'} ${endpoint}`);
  console.log('🔑 Token:', token ? 'present' : 'none');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('📡 Sending request to:', url);
    const response = await fetch(url, config);
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    const data = await response.json();
    console.log('📡 Response data:', data);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login (only if not already there)
        removeToken();
        if (window.location.pathname !== '/login' && window.location.pathname !== '/debug-login') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.data?.token) {
      setToken(data.data.token);
    }
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.data?.token) {
      setToken(data.data.token);
    }
    return data;
  },

  getProfile: async () => {
    return await apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    removeToken();
  },
};

// Restaurants API
export const restaurantsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/restaurants?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/restaurants/${id}`);
  },

  getCategories: async () => {
    return await apiRequest('/restaurants/categories');
  },

  getFeatured: async () => {
    return await apiRequest('/restaurants/featured/list');
  },

  toggleFavorite: async (id) => {
    return await apiRequest(`/restaurants/${id}/favorite`, {
      method: 'POST',
    });
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    return await apiRequest('/cart');
  },

  add: async (itemData) => {
    return await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  update: async (itemId, quantity) => {
    return await apiRequest(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (itemId) => {
    return await apiRequest(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return await apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  },

  applyPromo: async (promoCode) => {
    return await apiRequest('/cart/apply-promo', {
      method: 'POST',
      body: JSON.stringify({ promoCode }),
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/orders?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/orders/${id}`);
  },

  create: async (orderData) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  cancel: async (id) => {
    return await apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },

  track: async (orderNumber) => {
    return await apiRequest(`/orders/track/${orderNumber}`);
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return await apiRequest('/users/profile');
  },

  addAddress: async (addressData) => {
    return await apiRequest('/users/addresses', {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (addressId, addressData) => {
    return await apiRequest(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (addressId) => {
    return await apiRequest(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  getFavorites: async () => {
    return await apiRequest('/users/favorites');
  },
};

export { getToken, setToken, removeToken };
