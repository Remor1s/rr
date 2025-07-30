
import { Router } from 'express';
import logService from '../services/logService';

const router = Router();

router.get('/', (req, res) => {
    res.json(logService.getAll());
});

export default router;
