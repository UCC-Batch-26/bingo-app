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
      
      // Remove all players from the room
      await Card.updateMany({ room: code }, { $set: { room: '' } });
      
      log('room', `Removed ${playersInRoom.length} players from room ${code} because host left`);
      
      // Notify each player that they've been removed
      const pusher = req.app.get('pusher');
      if (pusher && playersInRoom.length > 0) {
        for (const player of playersInRoom) {
          pusher.trigger(`room-${code}`, 'player-left', {
            roomCode: code,
            playerName: player.name,
            playerId: player._id,
            reason: 'host-left'
          });
        }
        log('pusher', `Notified ${playersInRoom.length} players that host left room ${code}`);
      }
    }

    const pusher = req.app.get('pusher');
    if (pusher) {
      pusher.trigger(`room-${code}`, 'room-status-changed', {
        roomCode: code,
        status: status,
        room: room,
      });
      log('pusher', `Triggered room-status-changed event for room ${code}: ${status}`);
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
