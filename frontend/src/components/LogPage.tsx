
import React, { useState, useEffect } from 'react';

const LogPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/logs');
                const data = await response.json();
                setLogs(Array.isArray(data) ? data.reverse() : []);
            } catch (e) {
                console.error("Failed to fetch logs", e);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 3000); // Обновляем логи каждые 3 секунды
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Журнал действий</h2>
            <div style={{
                backgroundColor: 'var(--background-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '15px',
                height: '70vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse' // Новые логи появляются сверху
            }}>
                {logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong style={{ color: 'var(--primary-color)' }}>
                            {new Date(log.timestamp).toLocaleString()}
                        </strong>: {log.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogPage;
