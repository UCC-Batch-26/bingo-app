import { Card } from '#modules/card/models/card.js';
import { log } from '#utils/log.js';

export async function updateCardRoom(req, res) {
  const { id } = req.params;
  const { room } = req.body;
  try {
    const card = await Card.findByIdAndUpdate(id, { $set: { room } }, { new: true });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    return res.json(card);
  } catch (error) {
    log('getRoom', 'Unable to update Card:', error);

    let statusCode = 400;

    if (error.name === 'DocumentNotFoundError') {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to update Card',
    });
  }
}
