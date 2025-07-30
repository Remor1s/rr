
import { Router } from 'express';
import prisma from '../db';
import { getShopService } from '../services/serviceFactory';
import { getStatusType, OrderStatusType } from '../services/statusMapper';
import { moySkladService } from './moySklad';
import logService from '../services/logService';

const router = Router();

router.get('/', async (req, res) => {
    const orders = await prisma.order.findMany({ include: { shop: true }, orderBy: { createdAt: 'desc' } });
    res.json(orders);
});

router.get('/sync', async (req, res) => {
    if (!moySkladService) return res.status(400).json({ message: 'Сервис МойСклад не инициализирован.' });
    
    try {
        const shops = await prisma.shop.findMany();
        logService.add(`[SYNC] Запущена синхронизация заказов для ${shops.length} магазинов.`);
        
        for (const shop of shops) {
            const service = getShopService(shop);
            if (!service) continue;
            
            const orders = await service.getOrders();
            for (const orderData of orders) {
                const orderId = String(orderData.posting_number || orderData.order_id);
                const currentStatus = orderData.status;
                const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
                
                if (!existingOrder) {
                    // Обработка нового заказа
                    logService.add(`[SYNC] Обнаружен новый заказ #${orderId} со статусом '${currentStatus}'.`);
                    const statusType = getStatusType(shop.marketplace, currentStatus);

                    if (statusType === OrderStatusType.AWAITING_PROCESSING) {
                        // ... (код создания Заказа Покупателя, он уже корректен)
                    } else {
                        await prisma.order.create({
                            data: { id: orderId, shopId: shop.id, status: currentStatus, createdAt: new Date(orderData.in_process_at) }
                        });
                    }

                } else if (existingOrder.status !== currentStatus) {
                    // Обработка изменения статуса
                    logService.add(`[SYNC] Статус заказа #${orderId} изменился: '${existingOrder.status}' -> '${currentStatus}'.`);
                    const oldStatusType = getStatusType(shop.marketplace, existingOrder.status);
                    const newStatusType = getStatusType(shop.marketplace, currentStatus);

                    if (newStatusType === OrderStatusType.IN_TRANSIT && oldStatusType === OrderStatusType.AWAITING_PROCESSING && existingOrder.msCustomerOrderId) {
                        try { await moySkladService.createShipment(existingOrder.msCustomerOrderId); } catch (e) {}
                    }
                    
                    if (newStatusType === OrderStatusType.RETURNED && existingOrder.msCustomerOrderId) {
                        try { await moySkladService.createReturn(existingOrder.msCustomerOrderId); } catch (e) {}
                    }

                    await prisma.order.update({ where: { id: orderId }, data: { status: currentStatus } });
                }
            }
        }
        logService.add('[SYNC] Синхронизация заказов завершена.');
        res.json({ message: 'Синхронизация завершена' });
    } catch (e) {
        logService.add(`[ERROR] Критическая ошибка при синхронизации заказов: ${e}`);
        res.status(500).json({ message: 'Ошибка при синхронизации заказов' });
    }
});

export default router;
