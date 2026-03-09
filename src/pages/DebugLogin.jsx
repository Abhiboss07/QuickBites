import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContextBackend';

export default function DebugLogin() {
  const { user, isAuthenticated, loading, login } = useApp();
  const [email, setEmail] = useState('foodie@quickbites.com');
  const [password, setPassword] = useState('password123');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    console.log('DebugLogin - User state:', { user, isAuthenticated, loading });
  }, [user, isAuthenticated, loading]);

  const handleTestLogin = async () => {
    setTestResult('Testing login...');
    try {
      console.log('Attempting login with:', { email, password });
      await login({ email, password });
      setTestResult('✅ Login successful!');
      console.log('Login completed successfully');
    } catch (error) {
      console.error('Login failed:', error);
      setTestResult(`❌ Login failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>🔧 Debug Login</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Current State:</strong>
        <ul>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</li>
          <li>User: {user ? user.name : 'None'}</li>
        </ul>
      </div>

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
          onClick={handleTestLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Login
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '1rem',
          marginTop: '1rem',
          backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          {testResult}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Test Results:</h3>
        <p>Check the browser console for detailed logs.</p>
        <p>If login works, you should be redirected to /home automatically.</p>
      </div>
    </div>
  );
}
