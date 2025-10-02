import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function updateRoomStatus(req, res) {
  const { id: code } = req.params;
  const { status } = req.body;
  try {
    const room = await Room.findOneAndUpdate({ code }, { $set: { status } }, { new: true });
    return res.status(200).json(room);
  } catch (error) {
    log('getRoom', 'Unable to update Room Drawn Number:', error);

    let statusCode = 400;

    if (error.name === 'DocumentNotFoundError') {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to update Room Drawn Number',
    });
  }
}
