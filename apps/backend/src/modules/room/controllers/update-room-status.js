import { Room } from '#modules/room/models/room.js';
import { Card } from '#modules/card/models/card.js';
import { log } from '#utils/log.js';

export async function updateRoomStatus(req, res) {
  const { id: code } = req.params;
  const { status } = req.body;
  try {
    const room = await Room.findOneAndUpdate({ code }, { $set: { status } }, { new: true });

    // If room is being ended, remove all players from the room
    if (status === 'ended') {
      const playersInRoom = await Card.find({ room: code });

      await Card.updateMany({ room: code }, { $set: { room: '' } });

      log('room', `Removed ${playersInRoom.length} players from room ${code} because host left`);

      const pusher = req.app.get('pusher');
      if (pusher && playersInRoom.length > 0) {
        log('pusher', `Attempting to notify ${playersInRoom.length} players that host left room ${code}`);
        for (const player of playersInRoom) {
          pusher
            .trigger(`room-${code}`, 'player-left', {
              roomCode: code,
              playerName: player.name,
              playerId: player._id,
              reason: 'host-left',
            })
            .then(() => {
              log('pusher', `Successfully notified player ${player.name} that host left room ${code}`);
            })
            .catch((error) => {
              log(
                'pusher',
                `ERROR: Failed to notify player ${player.name} that host left room ${code}:`,
                error.message,
              );
            });
        }
      } else if (!pusher) {
        log('pusher', `ERROR: Pusher instance not available for host-left notifications in room ${code}`);
      }
    }

    const pusher = req.app.get('pusher');
    if (pusher) {
      log('pusher', `Attempting to trigger room-status-changed event for room ${code}: ${status}`);
      pusher
        .trigger(`room-${code}`, 'room-status-changed', {
          roomCode: code,
          status: status,
          room: room,
        })
        .then(() => {
          log('pusher', `Successfully triggered room-status-changed event for room ${code}: ${status}`);
        })
        .catch((error) => {
          log('pusher', `ERROR: Failed to trigger room-status-changed event for room ${code}:`, error.message);
        });
    } else {
      log('pusher', `ERROR: Pusher instance not available for room-status-changed event in room ${code}`);
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
