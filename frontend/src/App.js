import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Customers from './Customers'
import Lots from './Lots'

function App() {
  return (
    <Router>
      <div>
        <nav style={{ backgroundColor: '#333', padding: '10px', marginBottom: '20px' }}>
          <Link to='/' style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}> Главная</Link>
          <Link to='/customers' style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}> Контрагенты</Link>
          <Link to='/lots' style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}> Лоты</Link>
        </nav>
        <div padding='20px'>
          <Routes>
            <Route path="/" element={
              <div>
                <h2>Выберете раздел в меню навигации</h2>
              </div>
            } />
            <Route path="/customers" element={<Customers />} />
            <Route path="/lots" element={<Lots />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;