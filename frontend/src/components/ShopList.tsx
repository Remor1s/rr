
import React, { useState, useEffect } from 'react';

interface Shop {
  id: number;
  displayName: string;
  marketplace: string;
}

const ShopList: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shops');
        const data = await response.json();
        setShops(data);
      } catch (error) {
        console.error('Ошибка при загрузке списка магазинов:', error);
      }
    };
    fetchShops();
  }, []);

  return (
    <div>
      <h4>Подключенные магазины</h4>
      {shops.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Нет добавленных магазинов.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {shops.map(shop => (
            <li key={shop.id} style={{ marginBottom: '5px' }}>
              <strong>{shop.displayName}</strong> ({shop.marketplace})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShopList;
