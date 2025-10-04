import { Room } from '#modules/room/models/room.js';
import { Card } from '#modules/card/models/card.js';
import { log } from '#utils/log.js';

export async function verifyToken(req, res) {
  const { sessionToken } = req.params;

  try {
    const room = await Room.findOne({
      sessionToken,
      status: { $ne: 'ended' },
    });

    if (room) {
      return res.json({
        session: 'active',
        isHost: true,
        name: 'Host',
        roomId: room.code,
        status: room.status,
      });
    }

    const card = await Card.findOne({ sessionToken });

    if (card) {
      const room = await Room.findOne({ code: card.room });

      if (room && room.status !== 'ended') {
        return res.json({
          session: 'active',
          name: card.name,
          isHost: false,
          roomId: room.code,
          status: room.status,
        });
      }
    }

    return res.status(404).json({
      session: 'inactive',
      message: 'No active session found for this token',
    });
  } catch (error) {
    log('getRoom', 'Unable to retrieve Room:', error);

    const statusCode = error.name === 'DocumentNotFoundError' ? 404 : 400;

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to retrieve Room',
    });
  }
}
