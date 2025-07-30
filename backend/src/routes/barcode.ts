
import { Router } from 'express';
import { createBarcodePdf } from '../services/pdfService';

const router = Router();

router.post('/generate', async (req, res) => {
    const { items } = req.body; // Ожидаем массив объектов { barcode: '...', text: '...' }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Необходимо передать массив items для генерации PDF.' });
    }

    try {
        const pdfBuffer = await createBarcodePdf(items);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=barcodes.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
        res.status(500).json({ message: 'Не удалось сгенерировать PDF файл.' });
    }
});

export default router;
