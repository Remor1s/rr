// Этот файл отвечает за преобразование статусов маркетплейсов
// в унифицированные типы статусов, используемые в приложении.

// Эти типы статусов соответствуют бизнес-логике, описанной в ТЗ.
export enum OrderStatusType {
    AWAITING_PROCESSING, // А. Поступил, не отгружен со склада (резервирует товар).
    IN_TRANSIT,          // Б. Физически отгружен со склада (в пути к клиенту).
    DELIVERED,           // Б. Доставлен клиенту.
    RETURNED,            // В. Возвращен на склад после доставки (требует оформления возврата).
    LOST_COMPENSATED,    // Г. Потерян или утилизирован с компенсацией от МП (возврат не нужен).
    CANCELLED,           // Г. Отменен до отгрузки (возврат не нужен).
    UNKNOWN,             // Неизвестный или необрабатываемый статус.
}


// Карта статусов Ozon -> Тип статуса по ТЗ
// Основано на документации Ozon Seller API.
const ozonStatusMap: { [key: string]: OrderStatusType } = {
    'awaiting_packaging': OrderStatusType.AWAITING_PROCESSING,
    'awaiting_deliver': OrderStatusType.AWAITING_PROCESSING,
    'not_accepted': OrderStatusType.AWAITING_PROCESSING, // Не принят в сортировочном центре
    'delivering': OrderStatusType.IN_TRANSIT,
    'driver_pickup': OrderStatusType.IN_TRANSIT,
    'delivered': OrderStatusType.DELIVERED,
    'cancelled': OrderStatusType.CANCELLED,
    'returned_to_seller': OrderStatusType.RETURNED, // Возвращено продавцу
    'returning_to_seller': OrderStatusType.RETURNED, // Возвращается продавцу
    'lost': OrderStatusType.LOST_COMPENSATED,
    'compensated': OrderStatusType.LOST_COMPENSATED,
};

// Карта статусов Yandex.Market -> Тип статуса по ТЗ (симуляция на основе общей логики)
const yandexStatusMap: { [key: string]: OrderStatusType } = {
    'PROCESSING': OrderStatusType.AWAITING_PROCESSING,
    'READY_TO_SHIP': OrderStatusType.AWAITING_PROCESSING,
    'SHIPPED': OrderStatusType.IN_TRANSIT,
    'DELIVERED': OrderStatusType.DELIVERED,
    'CANCELLED_BEFORE_PROCESSING': OrderStatusType.CANCELLED,
    'CANCELLED_IN_PROCESSING': OrderStatusType.CANCELLED,
    'CANCELLED_IN_DELIVERY': OrderStatusType.LOST_COMPENSATED, // Отмена в пути часто означает утерю/компенсацию
    'RETURNED': OrderStatusType.RETURNED,
};

// Карта статусов Wildberries -> Тип статуса по ТЗ (симуляция на основе общей логики)
const wbStatusMap: { [key: string]: OrderStatusType } = {
    'new': OrderStatusType.AWAITING_PROCESSING, // Новые заказы
    'confirm': OrderStatusType.AWAITING_PROCESSING, // Подтвержденные СЦ
    'complete': OrderStatusType.IN_TRANSIT, // Отсортировано СЦ
    'sold': OrderStatusType.DELIVERED, // Продано
    'cancel': OrderStatusType.CANCELLED, // Отмена
    'return': OrderStatusType.RETURNED, // Возврат
    'defective': OrderStatusType.LOST_COMPENSATED, // Брак (не требует возврата в МойСклад)
};


/**
 * Преобразует статус конкретного маркетплейса в общий тип статуса приложения.
 * @param marketplace - Название маркетплейса ('Ozon', 'Yandex', 'WB').
 * @param status - Статус заказа из API маркетплейса.
 * @returns Общий тип статуса OrderStatusType или UNKNOWN, если соответствие не найдено.
 */
export function getStatusType(marketplace: string, status: string): OrderStatusType {
    switch (marketplace) {
        case 'Ozon':
            return ozonStatusMap[status] || OrderStatusType.UNKNOWN;
        case 'Yandex':
            return yandexStatusMap[status.toUpperCase()] || OrderStatusType.UNKNOWN;
        case 'WB':
            return wbStatusMap[status] || OrderStatusType.UNKNOWN;
        default:
            return OrderStatusType.UNKNOWN;
    }
}
