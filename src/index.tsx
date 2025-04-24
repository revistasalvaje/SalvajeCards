import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Asegúrate de que esta importación sea correcta
// Si App está exportado como 'App' y no como exportación por defecto, cambia a:
// import { App } from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)