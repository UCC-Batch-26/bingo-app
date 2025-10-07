import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

export async function updateDrawnNumber(req, res) {
  const { id: code } = req.params;
  const { drawnNumber } = req.body;
  try {
    const room = await Room.findOneAndUpdate({ code, status: 'live' }, { $push: { drawnNumber } }, { new: true });

    const pusher = req.app.get('pusher');
    if (pusher) {
      try {
        await pusher.trigger(`room-${code}`, 'number-drawn', {
          roomCode: code,
          newNumber: drawnNumber,
          allNumbers: room.drawnNumber,
        });
        log('pusher', `Triggered number-drawn event for room ${code}: ${drawnNumber}`);
      } catch (err) {
        log('pusher', `Failed to trigger number-drawn for room ${code}:`, err);
      }
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
