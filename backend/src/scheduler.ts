
import cron from 'node-cron';
import logService from './services/logService';

const CRON_SCHEDULE = '*/5 * * * *'; // Каждые 5 минут

export function startScheduler() {
    logService.add(`[SCHEDULER] Планировщик запущен. Синхронизация будет выполняться каждые 5 минут.`);

    cron.schedule(CRON_SCHEDULE, async () => {
        logService.add(`[SCHEDULER] Запуск автоматической синхронизации заказов...`);
        try {
            // Мы "вызываем" наш собственный API. Это хороший паттерн, чтобы не дублировать код.
            // Примечание: Для production лучше использовать прямой вызов функции, а не HTTP-запрос.
            const response = await fetch('http://localhost:5000/api/orders/sync');
            
            if (!response.ok) {
                throw new Error(`Статус ответа: ${response.status}`);
            }
            
            logService.add(`[SCHEDULER] Автоматическая синхронизация успешно завершена.`);

        } catch (error) {
            logService.add(`[SCHEDULER ERROR] Ошибка во время автоматической синхронизации: ${error}`);
        }
    });
}
