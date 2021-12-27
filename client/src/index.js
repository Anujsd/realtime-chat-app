import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './context/chatProvider';

const colors = {
  dark1: '#222831',
  dark2: '#393E46',
  gray1: '#F5F5F5',
  gray2: '#EEEEEE',
  blue1: '#36454f',
};

const theme = extendTheme({ colors });

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById('root')
);
