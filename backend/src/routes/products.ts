
import { Router } from 'express';
import prisma from '../db';
import { getShopService } from '../services/serviceFactory';
import { moySkladService } from './moySklad';
import logService from '../services/logService';

const router = Router();

// [GET] /api/products/
router.get('/', async (req, res) => {
    try {
        const moySkladProducts = await prisma.moySkladProduct.findMany({
            include: { ProductLink: { include: { marketplaceProduct: { include: { shop: true } } } } }
        });
        const allMarketplaceProducts = await prisma.marketplaceProduct.findMany({ include: { ProductLink: true } });
        const unlinkedMarketplaceProducts = allMarketplaceProducts.filter(p => p.ProductLink.length === 0);
        res.json({ moySkladProducts, unlinkedMarketplaceProducts });
    } catch (e) { res.status(500).json({ message: "Ошибка загрузки данных" }); }
});

// [GET] /api/products/sync-marketplaces
router.get('/sync-marketplaces', async (req, res) => {
    try {
        const shops = await prisma.shop.findMany();
        logService.add(`Начата синхронизация товаров для ${shops.length} магазинов.`);
        for (const shop of shops) {
            const service = getShopService(shop);
            if (service) {
                const products = await service.getProducts();
                for (const product of products) {
                    const productId = String(product.product_id || product.id);
                    await prisma.marketplaceProduct.upsert({
                        where: { id: productId },
                        update: { name: product.name || product.offer_id },
                        create: { id: productId, offerId: product.offer_id, name: product.name || product.offer_id, shopId: shop.id }
                    });
                }
            }
        }
        logService.add('Синхронизация товаров с МП завершена.');
        res.json({ message: 'Синхронизация завершена' });
    } catch (e) { res.status(500).json({ message: 'Ошибка при синхронизации с маркетплейсами' }); }
});

// [GET] /api/products/sync-moysklad
router.get('/sync-moysklad', async (req, res) => {
    if (!moySkladService) return res.status(400).json({ message: 'Сервис МойСклад не инициализирован' });
    try {
        const data = await moySkladService.getProducts();
        for (const product of data.rows) {
            await prisma.moySkladProduct.upsert({
                where: { id: product.id },
                update: { name: product.name, article: product.article },
                create: { id: product.id, name: product.name, article: product.article }
            });
        }
        logService.add('Синхронизация товаров с МойСклад завершена.');
        res.json({ message: 'Синхронизация завершена' });
    } catch (e) { res.status(500).json({ message: 'Ошибка при синхронизации с МойСклад' }); }
});

// [POST] /api/products/link
router.post('/link', async (req, res) => {
    const { moySkladProductId, marketplaceProductIds } = req.body;
    if (!moySkladProductId || !marketplaceProductIds || !Array.isArray(marketplaceProductIds)) {
        return res.status(400).json({ message: 'Неверные данные' });
    }
    try {
        for (const mpId of marketplaceProductIds) {
            await prisma.productLink.create({
                data: {
                    moySkladProductId: moySkladProductId,
                    marketplaceProductId: mpId,
                }
            });
        }
        logService.add(`Создана связь для товара МойСклад ${moySkladProductId}.`);
        res.status(201).json({ message: 'Связи успешно созданы' });
    } catch (e) { res.status(500).json({ message: 'Ошибка создания связи' }); }
});

// [POST] /api/products/auto-link
router.post('/auto-link', async (req, res) => {
    try {
        logService.add('[AUTO-LINK] Запущена автоматическая привязка товаров по артикулу.');
        const unlinkedMpProducts = await prisma.marketplaceProduct.findMany({ where: { ProductLink: { none: {} } } });
        const moySkladProducts = await prisma.moySkladProduct.findMany({ where: { article: { not: null } } });
        let linkedCount = 0;
        for (const mpProduct of unlinkedMpProducts) {
            const matchingMsProduct = moySkladProducts.find(ms => ms.article && mpProduct.offerId && ms.article.toLowerCase() === mpProduct.offerId.toLowerCase());
            if (matchingMsProduct) {
                await prisma.productLink.create({
                    data: { moySkladProductId: matchingMsProduct.id, marketplaceProductId: mpProduct.id }
                });
                linkedCount++;
            }
        }
        logService.add(`[AUTO-LINK] Успешно связано ${linkedCount} товаров.`);
        res.json({ message: `Авто-привязка завершена. Связано ${linkedCount} товаров.` });
    } catch (e) {
        logService.add(`[AUTO-LINK ERROR] Ошибка: ${e}`);
        res.status(500).json({ message: 'Произошла ошибка во время авто-привязки.' });
    }
});

// [POST] /api/products/update-price
router.post('/update-price', async (req, res) => {
    const { shopId, productId, price, oldPrice } = req.body;
    if (!shopId || !productId || price === undefined || oldPrice === undefined) {
        return res.status(400).json({ message: 'Не все поля заполнены' });
    }

    try {
        const shop = await prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) {
            return res.status(404).json({ message: 'Магазин не найден' });
        }
        
        const service = getShopService(shop);
        if (service && typeof service.updatePrice === 'function') {
            await service.updatePrice(productId, price, oldPrice);
            logService.add(`Обновлена цена для товара ${productId} в магазине ${shop.displayName}.`);
            res.json({ message: 'Цена успешно обновлена' });
        } else {
            res.status(400).json({ message: 'Сервис для данного магазина не поддерживает обновление цен.' });
        }
    } catch (error) {
        logService.add(`Ошибка при обновлении цены для товара ${productId}.`);
        res.status(500).json({ message: 'Ошибка при обновлении цены' });
    }
});

export default router;
