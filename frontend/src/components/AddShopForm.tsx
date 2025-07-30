
import React, { useState } from 'react';

interface AddShopFormProps {
  onShopAdded: () => void;
}

const AddShopForm: React.FC<AddShopFormProps> = ({ onShopAdded }) => {
  const [marketplace, setMarketplace] = useState('Ozon');
  const [displayName, setDisplayName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const body: any = { marketplace, displayName, apiKey };
    if (marketplace === 'Ozon') {
      body.clientId = clientId;
    }

    try {
      const response = await fetch('http://localhost:5000/api/shops/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        onShopAdded();
        setDisplayName('');
        setApiKey('');
        setClientId('');
      } else {
        alert(`Ошибка: ${data.message}`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении магазина:', error);
      alert('Произошла ошибка при добавлении магазина.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4>Добавить магазин</h4>
      <label>Название</label>
      <input
        type="text"
        placeholder="Мой магазин на Ozon"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <label>Маркетплейс</label>
      <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)}>
        <option value="Ozon">Ozon</option>
        <option value="Yandex">Yandex</option>
        <option value="WB">WB</option>
      </select>
      
      {marketplace === 'Ozon' && (
        <>
          <label>Client-Id</label>
          <input
            type="text"
            placeholder="Ваш Client-Id"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </>
      )}
      
      <label>API Ключ</label>
      <input
        type="password"
        placeholder="••••••••••••••••"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        required
      />
      <button onClick={handleSubmit} disabled={isSubmitting} style={{marginTop: '10px'}}>
        {isSubmitting ? 'Добавление...' : 'Добавить магазин'}
      </button>
    </div>
  );
};

export default AddShopForm;
