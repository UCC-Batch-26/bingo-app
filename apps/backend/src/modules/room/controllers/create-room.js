import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export async function createRoom(req, res) {
  try {
    const randomCode = generateRoomCode();
    const sessionToken = uuidv4();
    const { mode } = req.body;
    const roomData = await Room.create({ code: randomCode, sessionToken, mode });

    return res.status(201).json({
      message: 'Successfully created Room',
      data: roomData,
    });
  } catch (error) {
    log('createRoom', 'Error creating room:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong creating room',
    });
  }
}

function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  const randomValues = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }

  return code;
}
