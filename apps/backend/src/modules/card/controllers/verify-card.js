import { Card } from '#modules/card/models/card.js';
import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function verifyCard(req, res) {
  try {
    const { roomCode, cardId } = req.body;
    let isWinner = false;

    const room = await Room.findOne({ code: roomCode });
    const card = await Card.findById(cardId);
    const drawnNumber = room.drawnNumber;
    const trueNumber = card.winningNumber;

    if (trueNumber.length == 9) {
      isWinner = trueNumber.every((num) => drawnNumber.includes(num));
    }

    return res.status(201).json({
      message: 'Successfully Verify Card',
      data: {
        winner: isWinner,
      },
    });
  } catch (error) {
    log('joinLobby', 'Error Verifying card:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong Verifying card',
    });
  }
}
