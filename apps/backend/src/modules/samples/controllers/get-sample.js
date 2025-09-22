import { Sample } from '#modules/samples/models/sample.js';
import { log } from '#utils/log.js';

export async function getSample(req, res) {
  const { id } = req.params;

  try {
    const sample = await Sample.findById(id).orFail();

    return res.status(200).json(sample);
  } catch (error) {
    log('getSample', 'Unable to retrieve Sample:', error);

    let statusCode = 400;

    if (error.name === 'DocumentNotFoundError') {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      error: error?.message ?? 'Unable to retrieve Sample',
    });
  }
}
