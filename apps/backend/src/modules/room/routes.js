import { Router } from 'express';
import { createRoom } from './controllers/create-room.js';
import { getRoom } from './controllers/get-room.js';

const router = new Router();

router.post('/', createRoom);
router.get('/:id', getRoom);

export default router;
