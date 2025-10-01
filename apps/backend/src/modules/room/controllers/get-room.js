import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function getRoom(req, res) {
  const { id: code } = req.params;

  try {
    const room = await Room.findOne({ code: code });

    return res.status(200).json(room);
  } catch (error) {
    log('getRoom', 'Unable to retrieve Room:', error);

    let statusCode = 400;

    if (error.name === 'DocumentNotFoundError') {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to retrieve Room',
    });
  }
}
