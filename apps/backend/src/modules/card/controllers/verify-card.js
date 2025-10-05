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

    const allMarkedAreDrawn = marked.length > 0 ? marked.every((num) => drawnNumbers.includes(num)) : false;
    const markedNumbersMatchCard = marked.length > 0 ? marked.every((num) => cardNumbers.includes(num)) : false;

    isWinner = marked.length > 0 && allMarkedAreDrawn && markedNumbersMatchCard;

    if (!isWinner) {
      return res.status(400).json({
        message: 'Not win yet: check your card',
        data: {
          isWin: false,
          verified: false,
        },
      });
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
