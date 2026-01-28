import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout } from '@consta/uikit/Layout';
import { Card } from '@consta/uikit/Card';
import { Text } from '@consta/uikit/Text';

import Customers from './Customers';
import Lots from './Lots';

import './App.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <Card className="nav-header">
      <Layout direction="row" justify="space-between" align="center" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Главная
          </Link>
          <Link to="/customers" className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`}>
            Контрагенты
          </Link>
          <Link to="/lots" className={`nav-link ${location.pathname === '/lots' ? 'active' : ''}`}>
            Лоты
          </Link>
        </div>

      </Layout>
    </Card>
  );
};

function App() {
  return (
    <Router>
      <Layout direction="column" style={{ minHeight: '100vh' }}>
        <Navigation />

        <div className="main-content">
          <Routes>
            <Route path="/" element={

              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Text size="2xl" weight="bold" style={{ marginBottom: '16px' }}>
                  Добро пожаловать в Control system of Customers and Lots
                </Text>
                <Text size="l" view="secondary">
                  Выберите раздел в меню навигации для работы с данными
                </Text>
              </div>

            } />
            <Route path="/customers" element={<Customers />} />
            <Route path="/lots" element={<Lots />} />
          </Routes>
        </div>

        <div className="footer">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <Text size="s"> 2026</Text>
          </div>
        </div>
      </Layout>
    </Router>
  );
}

export default App;