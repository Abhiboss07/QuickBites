import React, { useState } from 'react';

export default function SimpleLoginTest() {
  const [email, setEmail] = useState('foodie@quickbites.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    console.log('=== Simple Login Test ===');
    console.log('Email:', email);
    console.log('Password:', password ? '[REDACTED]' : '[EMPTY]');
    
    try {
      console.log('🔄 Making fetch request...');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      
      if (response.ok) {
        setResult('✅ Login Successful! Token: ' + data.data.token.substring(0, 20) + '...');
        localStorage.setItem('token', data.data.token);
        console.log('✅ Token saved to localStorage');
      } else {
        setResult('❌ Login Failed: ' + data.message);
        console.log('❌ Login failed:', data.message);
      }
    } catch (error) {
      setResult('❌ Fetch Error: ' + error.message);
      console.error('❌ Fetch error:', error);
      console.error('❌ Error details:', error.stack);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Simple Login Test</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        
        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </div>

      {result && (
        <div style={{
          padding: '1rem',
          marginTop: '1rem',
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Instructions:</h3>
        <p>1. Open browser console (F12)</p>
        <p>2. Click "Test Login" button</p>
        <p>3. Check console for detailed logs</p>
        <p>4. Check network tab for request details</p>
      </div>
    </div>
  );
}
