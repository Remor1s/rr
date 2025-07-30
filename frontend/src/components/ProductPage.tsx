
import React, { useState, useEffect } from 'react';

const ProductPage: React.FC = () => {
    const [moySkladProducts, setMoySkladProducts] = useState<any[]>([]);
    const [unlinkedMpProducts, setUnlinkedMpProducts] = useState<any[]>([]);
    const [selectedMsProduct, setSelectedMsProduct] = useState<string | null>(null);
    const [selectedMpProducts, setSelectedMpProducts] = useState<Set<string>>(new Set());
    const [isAutoLinking, setIsAutoLinking] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            if (response.ok) {
                setMoySkladProducts(data.moySkladProducts || []);
                setUnlinkedMpProducts(data.unlinkedMarketplaceProducts || []);
            }
        } catch (e) { console.error(e) } 
    };

    useEffect(() => { fetchData(); }, []);
    
    const handleSync = async (url: string) => { await fetch(url); fetchData(); };

    const handleLink = async () => {
        if (!selectedMsProduct || selectedMpProducts.size === 0) return;
        await fetch('http://localhost:5000/api/products/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moySkladProductId: selectedMsProduct, marketplaceProductIds: Array.from(selectedMpProducts) }),
        });
        setSelectedMsProduct(null);
        setSelectedMpProducts(new Set());
        fetchData();
    };
    
    const handleSelectMp = (id: string) => {
        const newSelection = new Set(selectedMpProducts);
        newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
        setSelectedMpProducts(newSelection);
    };

    const handleAutoLink = async () => {
        setIsAutoLinking(true);
        try {
            const response = await fetch('http://localhost:5000/api/products/auto-link', { method: 'POST' });
            const data = await response.json();
            alert(data.message);
            fetchData();
        } catch (e) {
            alert('Ошибка авто-привязки');
        } finally {
            setIsAutoLinking(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Управление товарами</h2>
                <div>
                    <button onClick={() => handleSync('http://localhost:5000/api/products/sync-moysklad')}>Синхр. МойСклад</button>
                    <button onClick={() => handleSync('http://localhost:5000/api/products/sync-marketplaces')} style={{ marginLeft: '10px' }}>Синхр. МП</button>
                    <button onClick={handleAutoLink} disabled={isAutoLinking} style={{ marginLeft: '10px', backgroundColor: '#3ca93c' }}>
                        {isAutoLinking ? 'Выполнение...' : 'Авто-привязка'}
                    </button>
                </div>
            </div>

            {selectedMsProduct && selectedMpProducts.size > 0 && (
                <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--primary-color)' }}>
                    <button onClick={handleLink} style={{ width: '100%' }}>
                        Связать {selectedMpProducts.size} товар(а) с выбранным товаром "МойСклад"
                    </button>
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Товары "МойСклад"</h3>
                    {moySkladProducts.map(p => (
                        <div key={p.id} className="card" onClick={() => setSelectedMsProduct(p.id)} style={{ cursor: 'pointer', border: selectedMsProduct === p.id ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }}>
                            <strong>{p.name}</strong>
                            <div style={{ opacity: 0.7, fontSize: '0.9em', marginTop: '5px' }}>
                                {p.ProductLink.length > 0 ? "Связан с: " + p.ProductLink.map((l: any) => l.marketplaceProduct.name).join(', ') : "Нет связанных товаров"}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Несвязанные товары маркетплейсов</h3>
                    {unlinkedMpProducts.map(p => (
                         <div key={p.id} className="card" onClick={() => handleSelectMp(p.id)} style={{ cursor: 'pointer', border: selectedMpProducts.has(p.id) ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }}>
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
