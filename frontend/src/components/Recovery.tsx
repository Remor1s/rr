
import React, { useState } from 'react';

const Recovery: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);

    const handleRecovery = async () => {
        if (!startDate || !endDate) {
            alert('Выберите начальную и конечную даты.');
            return;
        }
        setIsRecovering(true);
        try {
            const response = await fetch('http://localhost:5000/api/recovery/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    marketplaces: ['Ozon', 'Yandex', 'WB']
                }),
            });
            const data = await response.json();
            alert(data.message || 'Ответ от сервера.');
        } catch (error) {
            console.error('Ошибка при запуске восстановления:', error);
            alert('Произошла ошибка.');
        } finally {
            setIsRecovering(false);
        }
    };

    return (
        <div>
            <h4>Восстановление учета</h4>
            <label>С:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <label>По:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button onClick={handleRecovery} disabled={isRecovering} style={{ marginTop: '10px' }}>
                {isRecovering ? 'Выполнение...' : 'Начать'}
            </button>
        </div>
    );
};

export default Recovery;
