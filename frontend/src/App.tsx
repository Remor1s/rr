
import React, { useState } from 'react';
import './App.css';
import AddShopForm from './components/AddShopForm';
import ShopList from './components/ShopList';
import MoySkladSettings from './components/MoySkladSettings';
import ProductPage from './components/ProductPage';
import OrderPage from './components/OrderPage';
import LogPage from './components/LogPage';
import Recovery from './components/Recovery';

type Tab = 'products' | 'orders' | 'logs';

function App() {
  const [shopsUpdated, setShopsUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const handleShopAdded = () => setShopsUpdated(!shopsUpdated);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Интеграция с Маркетплейсами</h1>
      </header>
      <main className="main-content">
        <div className="sidebar">
          <div className="card">
            <MoySkladSettings />
          </div>
          <div className="card">
            <AddShopForm onShopAdded={handleShopAdded} />
          </div>
          <div className="card">
            <ShopList key={shopsUpdated.toString()} />
          </div>
          <div className="card">
            <Recovery />
          </div>
        </div>
        <div className="content-area">
          <nav className="tab-nav">
            <button onClick={() => setActiveTab('products')} disabled={activeTab === 'products'}>Товары</button>
            <button onClick={() => setActiveTab('orders')} disabled={activeTab === 'orders'}>Заказы</button>
            <button onClick={() => setActiveTab('logs')} disabled={activeTab === 'logs'}>Журнал</button>
          </nav>
          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />
          {activeTab === 'products' && <ProductPage />}
          {activeTab === 'orders' && <OrderPage />}
          {activeTab === 'logs' && <LogPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
