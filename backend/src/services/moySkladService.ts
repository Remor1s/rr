
import axios from 'axios';
import logService from './logService';

const MOYSKLAD_API_URL = 'https://online.moysklad.ru/api/remap/1.2';

class MoySkladService {
  private api;
  private organization: any = null; // Здесь будет храниться ссылка на юр. лицо
  private defaultStore: any = null; // Склад по умолчанию
  private defaultAgent: any = null; // Контрагент по умолчанию

  constructor(apiToken: string) {
    this.api = axios.create({
      baseURL: MOYSKLAD_API_URL,
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Accept-Encoding': 'gzip' },
    });
  }
  
  // Инициализация сервиса: получение основных сущностей (юр.лицо, склад, контрагент)
  async init() {
      try {
          const [orgResponse, storeResponse, agentResponse] = await Promise.all([
              this.api.get('/entity/organization'),
              this.api.get('/entity/store'),
              this.api.get('/entity/counterparty?filter=name=Розничный покупатель') // Ищем контрагента по умолчанию
          ]);

          if (orgResponse.data.rows.length === 0) throw new Error('В МойСклад не найдено ни одного юр. лица.');
          this.organization = orgResponse.data.rows[0];

          if (storeResponse.data.rows.length === 0) throw new Error('В МойСклад не найдено ни одного склада.');
          this.defaultStore = storeResponse.data.rows[0];
          
          if (agentResponse.data.rows.length > 0) {
            this.defaultAgent = agentResponse.data.rows[0];
          } else {
            // Если контрагент не найден, можно создать его (для реального приложения)
            logService.add('[MoySklad] Контрагент "Розничный покупатель" не найден. Используется заглушка.');
            this.defaultAgent = { meta: { href: `${MOYSKLAD_API_URL}/entity/counterparty/DUMMY-AGENT-ID`, type: 'counterparty' }};
          }

          logService.add(`[MoySklad] Сервис инициализирован: ${this.organization.name}, Склад: ${this.defaultStore.name}`);
          return true;
      } catch (error) {
          logService.add(`[MoySklad ERROR] Ошибка инициализации: ${error}. Проверьте токен и права доступа.`);
          return false;
      }
  }

  // Получение товаров из МойСклад (оставляем симуляцию, т.к. требует реального API)
  async getProducts() {
      logService.add('[MoySklad] Запрос товаров из МойСклад (симуляция).');
      return {
          rows: [
              { id: 'ms-prod-1', name: 'Товар МойСклад 1', article: 'SKU001', meta: { href: `${MOYSKLAD_API_URL}/entity/product/ms-prod-1`} },
              { id: 'ms-prod-2', name: 'Товар МойСклад 2', article: 'SKU002', meta: { href: `${MOYSKLAD_API_URL}/entity/product/ms-prod-2`} },
              { id: 'ms-prod-3', name: 'Товар МойСклад 3', article: 'SKU003', meta: { href: `${MOYSKLAD_API_URL}/entity/product/ms-prod-3`} },
          ]
      };
  }

  // Создание Заказа Покупателя
  async createCustomerOrder(orderData: any, positions: any[]) {
    if (!this.organization || !this.defaultAgent) throw new Error('Сервис МойСклад не инициализирован.');

    const payload = {
      organization: { meta: this.organization.meta },
      agent: { meta: this.defaultAgent.meta },
      name: `Заказ МП #${orderData.posting_number || orderData.order_id}`,
      description: `Заказ с маркетплейса от ${new Date(orderData.in_process_at).toLocaleString()}`,
      positions: positions.map(p => ({
          quantity: p.quantity,
          price: p.price * 100, // Цена в копейках
          assortment: { meta: { href: p.msProductMetaHref, type: 'product' } }
      }))
    };

    logService.add(`[MoySklad] СИМУЛЯЦИЯ: Создание Заказа покупателя #${payload.name}.`);
    // Симуляция успешного ответа API
    return { ...payload, id: `ms-order-${Date.now()}`, meta: { href: `${MOYSKLAD_API_URL}/entity/customerorder/ms-order-${Date.now()}`} };
  }

  // Создание Отгрузки на основании Заказа Покупателя
  async createShipment(customerOrderId: string) {
      if (!this.organization || !this.defaultStore) throw new Error('Сервис МойСклад не инициализирован.');
      
      const payload = {
        organization: { meta: this.organization.meta },
        agent: { meta: this.defaultAgent.meta },
        store: { meta: this.defaultStore.meta },
        // Связываем отгрузку с заказом
        customerOrder: { meta: { href: `${MOYSKLAD_API_URL}/entity/customerorder/${customerOrderId}`, type: 'customerorder' } }
      };
      
      logService.add(`[MoySklad] СИМУЛЯЦИЯ: Создание Отгрузки для заказа ID: ${customerOrderId}.`);
      // Симуляция успешного ответа API
      return { ...payload, id: `ms-shipment-${Date.now()}` };
  }

  // Создание Возврата Покупателя на основании Заказа Покупателя
  async createReturn(customerOrderId: string) {
      if (!this.organization || !this.defaultStore) throw new Error('Сервис МойСклад не инициализирован.');
      
      const payload = {
          organization: { meta: this.organization.meta },
          agent: { meta: this.defaultAgent.meta },
          store: { meta: this.defaultStore.meta },
          // Связываем возврат с заказом
          customerOrder: { meta: { href: `${MOYSKLAD_API_URL}/entity/customerorder/${customerOrderId}`, type: 'customerorder' } }
      };

      logService.add(`[MoySklad] СИМУЛЯЦИЯ: Создание Возврата покупателя для заказа ID: ${customerOrderId}.`);
      // Симуляция успешного ответа API
      return { ...payload, id: `ms-return-${Date.now()}` };
  }
}

export default MoySkladService;
