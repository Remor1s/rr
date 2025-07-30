
import express from 'express';
import cors from 'cors';
import shopsRouter from './routes/shops';
import moySkladRouter from './routes/moySklad';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import barcodeRouter from './routes/barcode';
import logsRouter from './routes/logs';
import recoveryRouter from './routes/recovery';
import { startScheduler } from './scheduler'; // <-- Новый импорт

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/shops', shopsRouter);
app.use('/api/moysklad', moySkladRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/barcode', barcodeRouter);
app.use('/api/logs', logsRouter);
app.use('/api/recovery', recoveryRouter);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startScheduler(); // <-- Запускаем планировщик
});
