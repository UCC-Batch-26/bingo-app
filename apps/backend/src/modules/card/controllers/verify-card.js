import { Card } from '#modules/card/models/card.js';
import { Room } from '#modules/room/models/card.js';
import { log } from '#utils/log.js';

export async function verifyCard(req, res) {
  try {
    const { roomCode, cardId } = req.body;

    const room = await Room.findOne({ code: roomCode });
    const card = await Card.findById(cardId);
    const drawnNumber = room.drawnNumber;
    const trueNumber = card.winningNumber;

    const isWinner = trueNumber.every((num) => drawnNumber.includes(num));

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
