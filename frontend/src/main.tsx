import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { ConfigErrorScreen } from './components/ConfigErrorScreen'
import { loadConfig } from './config/env'
import { createServices } from './services'
import { ServicesProvider } from './services/ServicesProvider'
import './styles/global.css'

const result = loadConfig()
const root = createRoot(document.getElementById('root')!)

if (!result.ok) {
  root.render(<ConfigErrorScreen message={result.error} />)
} else {
  root.render(
    <StrictMode>
      <ServicesProvider services={createServices(result.config)}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </ServicesProvider>
    </StrictMode>,
  )
}
