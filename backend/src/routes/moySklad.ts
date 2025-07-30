
import { Router } from 'express';
import MoySkladService from '../services/moySkladService';

const router = Router();

// Экспортируем сервис, чтобы он был доступен другим модулям (временное решение)
export let moySkladService: MoySkladService | null = null;

router.post('/settings', async (req, res) => {
  const { apiToken } = req.body;
  if (!apiToken) {
    return res.status(400).json({ message: 'Необходимо предоставить API токен' });
  }
  
  moySkladService = new MoySkladService(apiToken);
  const success = await moySkladService.init();
  
  if (success) {
    res.json({ message: 'Настройки "МойСклад" успешно сохранены и сервис инициализирован.' });
  } else {
    moySkladService = null;
    res.status(400).json({ message: 'Не удалось инициализировать сервис. Проверьте токен.' });
  }
});

// ... (GET /products) ...

export default router;
