import { Card } from '#modules/card/models/card.js';
import { log } from '#utils/log.js';
//JOin lobby and generate card
export async function joinLobby(req, res) {
  try {
    const cardNumbers = generateNumber(9);
    //TO DO @use jwt token for session token
    const sessionToken = 123;
    const { name, room } = req.body;
    const card = await Card.create({ gridNumbers: cardNumbers, sessionToken, name, room });

    return res.status(201).json({
      message: 'Successfully created Card and Join lobby',
      data: card,
    });
  } catch (error) {
    log('joinLobby', 'Error creating card:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong creating card',
    });
  }
}


/* eslint-disable sonarjs/pseudo-random */
function generateNumber(count) {
  const numbers = [];
  while (numbers.length < 9) {
    const num = Math.floor(Math.random() * count) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}
/* eslint-enable sonarjs/pseudo-random */
