import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // pastikan ini ada!
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginGiveawayMempawah from './LoginGiveawayMempawah';
import LoginGiveawayKetapang from './LoginGiveawayKetapang';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login_mempawah" element={<LoginGiveawayMempawah />} />
        <Route path="/login_ketapang" element={<LoginGiveawayKetapang />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


