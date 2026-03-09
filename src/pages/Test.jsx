import React, { useState } from 'react';
import { useApp } from '../context/AppContextBackend';

export default function TestPage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    restaurants, 
    cart, 
    cartCount, 
    login, 
    loadRestaurants,
    addToCart 
  } = useApp();

  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    const results = [];
    
    // Test 1: Authentication
    try {
      await login({ email: 'foodie@quickbites.com', password: 'password123' });
      results.push({ test: 'Login', status: '✅ Pass', message: 'Authentication working' });
    } catch (error) {
      results.push({ test: 'Login', status: '❌ Fail', message: error.message });
    }

    // Test 2: Load Restaurants
    try {
      await loadRestaurants();
      results.push({ test: 'Load Restaurants', status: '✅ Pass', message: `Loaded ${restaurants.length} restaurants` });
    } catch (error) {
      results.push({ test: 'Load Restaurants', status: '❌ Fail', message: error.message });
    }

    // Test 3: Add to Cart
    try {
      if (restaurants.length > 0) {
        const firstRestaurant = restaurants[0];
        await addToCart({
          menuItem: firstRestaurant._id,
          restaurant: firstRestaurant._id,
          quantity: 1,
          price: 10.99
        });
        results.push({ test: 'Add to Cart', status: '✅ Pass', message: 'Item added to cart' });
      }
    } catch (error) {
      results.push({ test: 'Add to Cart', status: '❌ Fail', message: error.message });
    }

    setTestResults(results);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>QuickBites Backend Test Results</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Current App State:</h3>
        <ul>
          <li><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</li>
          <li><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</li>
          <li><strong>User:</strong> {user ? user.name : 'None'}</li>
          <li><strong>Restaurants:</strong> {restaurants.length}</li>
          <li><strong>Cart Items:</strong> {cartCount}</li>
        </ul>
      </div>

      <button 
        onClick={runTests}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        Run Backend Tests
      </button>

      {testResults.length > 0 && (
        <div>
          <h3>Test Results:</h3>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '1rem',
                margin: '0.5rem 0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: result.status.includes('Pass') ? '#d4edda' : '#f8d7da'
              }}
            >
              <strong>{result.test}:</strong> {result.status} - {result.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
