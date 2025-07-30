
// Простой сервис для хранения логов в памяти
class LogService {
    private logs: { date: Date, message: string }[] = [];

    add(message: string) {
        const logEntry = { date: new Date(), message };
        console.log(`[LOG]: ${message}`); // Также выводим в консоль сервера
        this.logs.unshift(logEntry); // Добавляем в начало
        if (this.logs.length > 200) { // Ограничиваем размер лога
            this.logs.pop();
        }
    }

    getAll() {
        return this.logs;
    }
}

// Создаем единственный экземпляр (синглтон)
const logService = new LogService();
export default logService;
