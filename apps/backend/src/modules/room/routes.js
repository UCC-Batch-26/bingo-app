import { Router } from 'express';
import { createRoom } from './controllers/create-room.js';
import { getRoom } from './controllers/get-room.js';
import { updateDrawnNumber } from './controllers/update-drawn-numbers.js';
import { updateRoomStatus } from './controllers/update-room-status.js';
import { verifyToken } from './controllers/verify-token.js';

const router = new Router();

router.post('/', createRoom);
router.get('/:id', getRoom);
router.patch('/:id', updateDrawnNumber);
router.patch('/status/:id', updateRoomStatus);
router.get('/verify/:sessionToken', verifyToken);

export default router;
