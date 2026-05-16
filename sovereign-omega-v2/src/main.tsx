import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>Sovereign Omega</h1>
      <p>Governance Runtime v0.5.3</p>
    </div>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
