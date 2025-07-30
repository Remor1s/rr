
import React, { useState } from 'react';

const MoySkladSettings: React.FC = () => {
    const [token, setToken] = useState('');

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/moysklad/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiToken: token }),
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Ошибка при сохранении токена.');
        }
    };

    return (
        <div>
            <h4>Настройки "МойСклад"</h4>
            <label>API Токен</label>
            <input 
              type="password" 
              placeholder="Введите ваш токен"
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
            />
            <button onClick={handleSave} style={{marginTop: '10px'}}>Сохранить токен</button>
        </div>
    );
};

export default MoySkladSettings;
