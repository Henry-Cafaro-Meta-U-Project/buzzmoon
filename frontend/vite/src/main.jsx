import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme  } from '@chakra-ui/react'
import App from './Components/App/App';
import './index.css';

const breakpoints = {
  sm: '320px',
  md: '950px',
  lg: '1300px',
  xl: '2000px',
  "2xl": '2500px'
}

// 3. Extend the theme
const theme = extendTheme({ breakpoints })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
