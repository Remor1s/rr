
import { Shop } from '@prisma/client';
import OzonService from './ozonService';
import YandexService from './yandexService';
import WBService from './wbService';

// Эта функция принимает объект магазина из БД и возвращает соответствующий инстанс сервиса
export function getShopService(shop: Shop): any {
    switch (shop.marketplace) {
        case 'Ozon':
            if (!shop.clientId) return null;
            return new OzonService({ 'Client-Id': shop.clientId, 'Api-Key': shop.apiKey });
        case 'Yandex':
            return new YandexService(shop.apiKey);
        case 'WB':
            return new WBService(shop.apiKey);
        default:
            return null;
    }
}
