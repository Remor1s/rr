
import logService from './logService';

class YandexService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        logService.add('[YandexService] Сервис инициализирован (симуляция).');
    }

    async getProducts() {
        logService.add('[YandexService] Запрос списка товаров (симуляция).');
        // Симуляция ответа API
        return [
            { id: 'YDX-001', offer_id: 'SKU-Y-100', name: 'Яндекс.Станция Лайт' },
            { id: 'YDX-002', offer_id: 'SKU-Y-200', name: 'Яндекс.Модуль' }
        ];
    }

    async getOrders() {
        logService.add('[YandexService] Запрос списка заказов (симуляция).');
        // Симуляция ответа API
        return [
            {
                order_id: 'YDX-ORDER-111',
                status: 'processing', // Статус, который нужно будет добавить в statusMapper
                in_process_at: new Date().toISOString(),
                products: [{ offer_id: 'SKU-Y-100', quantity: 1, price: 4990 }]
            }
        ];
    }

    async updatePrice(productId: string, price: number, oldPrice: number) {
        logService.add(`[YandexService] Обновление цены для ${productId}: цена ${price}, старая ${oldPrice} (симуляция).`);
        return { status: 'OK' };
    }
}

export default YandexService;
