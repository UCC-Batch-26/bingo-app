import { Card } from '#modules/card/models/card.js';
import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function verifyCard(req, res) {
  try {
    const { cardId, markedNumbers } = req.body;
    let isWinner = false;

    // Get the card to find the room
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        message: 'Card not found',
      });
    }

    // Get the room to check drawn numbers
    const room = await Room.findOne({ code: card.room });
    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    const drawnNumbers = (room.drawnNumber || []).map((n) => Number(n));
    const cardNumbers = (card.gridNumbers || []).map((n) => Number(n));
    const marked = Array.isArray(markedNumbers) ? markedNumbers.map((n) => Number(n)) : [];

    const allNumbersMarked = marked.length === 9;
    const allMarkedAreDrawn = marked.length > 0 ? marked.every((num) => drawnNumbers.includes(num)) : false;
    const markedNumbersMatchCard = marked.length > 0 ? marked.every((num) => cardNumbers.includes(num)) : false;

    isWinner = allNumbersMarked && allMarkedAreDrawn && markedNumbersMatchCard;

    if (!isWinner) {
      let errorMessage = 'Not win yet: ';
      if (!allNumbersMarked) {
        errorMessage += `You need to mark all 9 numbers on your card (currently marked: ${marked.length})`;
      } else if (!allMarkedAreDrawn) {
        errorMessage += 'Some of your marked numbers have not been drawn yet';
      } else if (!markedNumbersMatchCard) {
        errorMessage += 'Some marked numbers do not match your card';
      } else {
        errorMessage += 'Check your card';
      }

      return res.status(400).json({
        message: errorMessage,
        data: {
          isWin: false,
          verified: false,
          markedCount: marked.length,
          requiredCount: 9,
        },
      });
    }

    // Trigger player won event via Pusher
    const pusher = req.app.get('pusher');
    if (pusher) {
      log('pusher', `Attempting to trigger player-won event for room ${card.room}: ${card.name}`);
      pusher
        .trigger(`room-${card.room}`, 'player-won', {
          roomCode: card.room,
          playerName: card.name || 'Player',
          playerId: card._id,
          winType: 'BIT9O',
        })
        .then(() => {
          log('pusher', `Successfully triggered player-won event for room ${card.room}: ${card.name}`);
        })
        .catch((error) => {
          log('pusher', `ERROR: Failed to trigger player-won event for room ${card.room}:`, error.message);
        });
    } else {
      log('pusher', `ERROR: Pusher instance not available for player-won event in room ${card.room}`);
    }

    return res.status(200).json({
      message: 'Card verification completed',
      data: {
        isWin: isWinner,
        verified: true,
      },
    });
  } catch (error) {
    log('verifyCard', 'Error Verifying card:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong Verifying card',
    });
  }
}
