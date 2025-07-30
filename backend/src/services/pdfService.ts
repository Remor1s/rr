
import PDFDocument from 'pdfkit';
import bwip from 'bwip-js';

interface BarcodeData {
    barcode: string;
    text: string;
}

export async function createBarcodePdf(data: BarcodeData[]): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(16).text('Лист подбора', { align: 'center' });
    doc.moveDown();

    for (const item of data) {
        try {
            // Генерируем штрих-код
            const pngBuffer = await bwip.toBuffer({
                bcid: 'code128',    // Тип штрих-кода
                text: item.barcode, // Данные для кодирования
                scale: 3,           // Масштаб
                height: 10,         // Высота
                includetext: true,  // Включить текст под штрих-кодом
                textxalign: 'center',
            });
            
            // Добавляем штрих-код в PDF
            doc.image(pngBuffer, { width: 150, align: 'center' });
            doc.moveDown(0.5);

            // Добавляем описание
            doc.fontSize(10).text(item.text, { align: 'center' });
            doc.moveDown(2);

        } catch (err) {
            console.error('Ошибка генерации штрих-кода:', err);
            doc.fontSize(10).text(`Ошибка генерации для: ${item.barcode}`, { color: 'red' });
        }
    }

    return new Promise((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
        doc.end();
    });
}
