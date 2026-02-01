// Test backend connectivity
export async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:8080/api/grades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Backend connected successfully:', data)
      return { connected: true, data }
    } else {
      console.log('❌ Backend responded with error:', response.status)
      return { connected: false, error: response.status }
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error)
    return { connected: false, error: error.message }
  }
}

if (typeof window !== 'undefined') {
  window.testBackend = testBackendConnection
}