import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function updateRoomStatus(req, res) {
  const { id: code } = req.params;
  const { status } = req.body;
  try {
    const room = await Room.findOneAndUpdate({ code }, { $set: { status } }, { new: true });

    const io = req.app.get('io');
    if (io) {
      io.to(code).emit('room-status-changed', {
        roomCode: code,
        status: status,
        room: room,
      });
      log('socket', `Emitted room-status-changed event for room ${code}: ${status}`);
    }

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
