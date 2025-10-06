import { Card } from '#modules/card/models/card.js';
import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';
import { v4 as uuidv4 } from 'uuid';

//JOin lobby and generate card
export async function joinLobby(req, res) {
  try {
    const { name, room } = req.body;

    // Check if room exists
    const existingRoom = await Room.findOne({ code: room });
    if (!existingRoom) {
      return res.status(404).json({
        message: 'Room not exist',
      });
    }

    const cardNumbers = generateNumber(30);
    const sessionToken = uuidv4();
    const card = await Card.create({ gridNumbers: cardNumbers, sessionToken, name, room });

    const pusher = req.app.get('pusher');
    if (pusher) {
      log('pusher', `Attempting to trigger player-joined event for room ${room}: ${name}`);
      pusher.trigger(`room-${room}`, 'player-joined', {
        roomCode: room,
        playerName: name,
        playerId: card._id,
      })
      .then(() => {
        log('pusher', `Successfully triggered player-joined event for room ${room}: ${name}`);
      })
      .catch((error) => {
        log('pusher', `ERROR: Failed to trigger player-joined event for room ${room}:`, error.message);
      });
    } else {
      log('pusher', `ERROR: Pusher instance not available for player-joined event in room ${room}`);
    }

    return res.status(201).json({
      message: 'Successfully created Card and Join lobby',
      data: card,
    });
  } catch (error) {
    log('joinLobby', 'Error creating card:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong creating card',
    });
  }
}

/* eslint-disable sonarjs/pseudo-random */
function generateNumber(count) {
  const numbers = [];
  while (numbers.length < 9) {
    const num = Math.floor(Math.random() * count) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}
/* eslint-enable sonarjs/pseudo-random */
