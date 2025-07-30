
import { Router } from 'express';
import prisma from '../db';
import logService from '../services/logService';

const router = Router();

// Получаем список всех магазинов из БД
router.get('/', async (req, res) => {
    try {
        const shops = await prisma.shop.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(shops);
    } catch (error) {
        logService.add('Ошибка при получении списка магазинов из БД.');
        res.status(500).json({ message: 'Не удалось получить список магазинов' });
    }
});

// Создаем новый магазин в БД
router.post('/add', async (req, res) => {
    const { marketplace, apiKey, clientId, displayName } = req.body;

    if (!marketplace || !apiKey || !displayName) {
        return res.status(400).json({ message: 'Не все поля заполнены' });
    }

    try {
        const newShop = await prisma.shop.create({
            data: {
                displayName,
                marketplace,
                apiKey, // TODO: В реальном приложении ключи нужно шифровать
                clientId,
            },
        });
        
        logService.add(`Добавлен новый магазин: ${displayName} (${marketplace}).`);
        res.status(201).json({ message: 'Магазин успешно добавлен', shop: newShop });

    } catch (error) {
        logService.add(`Ошибка при добавлении магазина ${displayName} в БД.`);
        res.status(500).json({ message: 'Не удалось добавить магазин' });
    }
});

export default router;
