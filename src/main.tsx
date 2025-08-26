import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElm = document.getElementById('root')
if (!rootElm) {
    throw new Error('Failed to find the root element with ID "root".')
}

createRoot(rootElm).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
