// Simple test to isolate login fetch issue
const testLoginFetch = async () => {
  console.log('=== Testing Login Fetch ===');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'foodie@quickbites.com',
        password: 'password123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      localStorage.setItem('token', data.data.token);
      window.location.href = '/home';
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
};

// Auto-run test
testLoginFetch();
