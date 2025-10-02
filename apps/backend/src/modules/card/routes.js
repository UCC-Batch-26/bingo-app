import { Router } from 'express';
import { joinLobby } from './controllers/join-lobby.js';
import { getCard } from './controllers/get-card.js';

const router = new Router();

router.post('/lobby', joinLobby); //Join Lobby and Create Card
router.get('/:id', getCard);

export default router;
