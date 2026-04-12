import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('Loading...')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(data => setStatus(`Backend connected: ${JSON.stringify(data)}`))
      .catch(err => setStatus(`Backend error: ${err.message}`))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>InvoiceClaw</h1>
      <p>Frontend is live and talking to backend.</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Backend URL:</strong> {apiUrl}</p>
    </div>
  )
}

export default App
