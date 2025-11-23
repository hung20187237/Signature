import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import GlobalStyles from './GlobalStyles'
import './index.css'
import App from './App.jsx'

// Ant Design theme configuration
const antdTheme = {
  token: {
    colorPrimary: '#4f46e5', // Indigo-600 to match brand
    colorLink: '#4f46e5',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
    },
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ConfigProvider theme={antdTheme}>
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </StrictMode>,
)
