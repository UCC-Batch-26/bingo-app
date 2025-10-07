import { Card } from '#modules/card/models/card.js';
import { Room } from '#modules/room/models/room.js';
import { log } from '#utils/log.js';

function toNumbers(arr) {
  return Array.isArray(arr) ? arr.map((n) => Number(n)) : [];
}

function computeWin(drawnNumbers, cardNumbers, marked) {
  const allNumbersMarked = marked.length === 9;
  const allMarkedAreDrawn = marked.length > 0 ? marked.every((num) => drawnNumbers.includes(num)) : false;
  const markedNumbersMatchCard = marked.length > 0 ? marked.every((num) => cardNumbers.includes(num)) : false;

  return {
    isWinner: allNumbersMarked && allMarkedAreDrawn && markedNumbersMatchCard,
    allNumbersMarked,
    allMarkedAreDrawn,
    markedNumbersMatchCard,
  };
}

function buildNotWinMessage({ allNumbersMarked, allMarkedAreDrawn, markedNumbersMatchCard, markedCount }) {
  let errorMessage = 'Not win yet: ';

  if (!allNumbersMarked) {
    errorMessage += `You need to mark all 9 numbers on your card (currently marked: ${markedCount})`;
  } else if (!allMarkedAreDrawn) {
    errorMessage += 'Some of your marked numbers have not been drawn yet';
  } else if (!markedNumbersMatchCard) {
    errorMessage += 'Some marked numbers do not match your card';
  } else {
    errorMessage += 'Check your card';
  }

  return errorMessage;
}

export async function verifyCard(req, res) {
  try {
    const { cardId, markedNumbers } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const room = await Room.findOne({ code: card.room });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const drawnNumbers = toNumbers(room.drawnNumber || []);
    const cardNumbers = toNumbers(card.gridNumbers || []);
    const marked = toNumbers(markedNumbers);

    const { isWinner, allNumbersMarked, allMarkedAreDrawn, markedNumbersMatchCard } = computeWin(
      drawnNumbers,
      cardNumbers,
      marked,
    );

    if (!isWinner) {
      const errorMessage = buildNotWinMessage({
        allNumbersMarked,
        allMarkedAreDrawn,
        markedNumbersMatchCard,
        markedCount: marked.length,
      });

      return res.status(400).json({
        message: errorMessage,
        data: {
          isWin: false,
          verified: false,
          markedCount: marked.length,
          requiredCount: 9,
        },
      });
    }

    const pusher = req.app.get('pusher');
    if (pusher) {
      try {
        await pusher.trigger(`room-${card.room}`, 'player-won', {
          roomCode: card.room,
          playerName: card.name || 'Player',
          playerId: card._id,
          winType: 'BIT9O',
        });
        log('pusher', `Triggered player-won event for room ${card.room}: ${card.name}`);
      } catch (err) {
        log('pusher', `Failed to trigger player-won for room ${card.room}:`, err);
      }
    }

    return res.status(200).json({
      message: 'Card verification completed',
      data: {
        isWin: isWinner,
        verified: true,
      },
    });
  } catch (error) {
    log('verifyCard', 'Error Verifying card:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong Verifying card',
    });
  }
}
