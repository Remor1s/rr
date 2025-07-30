
import logService from './logService';

class WBService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        logService.add('[WBService] Сервис инициализирован (симуляция).');
    }

    async getProducts() {
        logService.add('[WBService] Запрос списка товаров (симуляция).');
        return [
            { id: 'WB-12345', offer_id: 'SKU-W-300', name: 'WB-Соковыжималка' },
            { id: 'WB-67890', offer_id: 'SKU-W-400', name: 'WB-Наушники' }
        ];
    }

    async getOrders() {
        logService.add('[WBService] Запрос списка заказов (симуляция).');
        return [
            {
                order_id: 'WB-ORDER-222',
                status: 'new', // Статус, который нужно будет добавить в statusMapper
                in_process_at: new Date().toISOString(),
                products: [{ offer_id: 'SKU-W-400', quantity: 2, price: 1999 }]
            }
        ];
    }

    async updatePrice(productId: string, price: number, oldPrice: number) {
        logService.add(`[WBService] Обновление цены для ${productId}: цена ${price}, старая ${oldPrice} (симуляция).`);
        return { status: 'OK' };
    }
}

export default WBService;
