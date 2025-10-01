import { Card } from '#modules/card/models/card.js';
import { log } from '#utils/log.js';

export async function getCard(req, res) {
  const { id } = req.params;

  try {
    //TO DO @populate with local and foreign field with Room Code
    const card = await Card.findById(id).orFail();

    return res.status(200).json(card);
  } catch (error) {
    log('getRoom', 'Unable to retrieve Card:', error);

    let statusCode = 400;

    if (error.name === 'DocumentNotFoundError') {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to retrieve Card',
    });
  }
}
