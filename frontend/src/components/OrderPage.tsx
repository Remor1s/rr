
import React, { useState, useEffect } from 'react';

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders');
            setOrders(await response.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await fetch('http://localhost:5000/api/orders/sync');
            await fetchData();
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Заказы</h2>
                <button onClick={handleSync} disabled={isSyncing}>
                    {isSyncing ? 'Синхронизация...' : 'Синхронизировать заказы'}
                </button>
            </div>
            <div style={{ marginTop: '20px' }}>
                {orders.map(order => (
                    <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <strong>Заказ #{order.id}</strong>
                            <p style={{ margin: '5px 0', opacity: 0.8 }}>{order.shop.displayName}</p>
                        </div>
                        <div>
                            <p style={{ margin: '5px 0' }}>Статус: <strong>{order.status}</strong></p>
                            <p style={{ margin: '5px 0', opacity: 0.8 }}>
                                Создан: {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;
