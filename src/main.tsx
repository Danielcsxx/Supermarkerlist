import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/global.scss';
import { ShoppingList } from './ShoppingList.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShoppingList />
  </React.StrictMode>,
);