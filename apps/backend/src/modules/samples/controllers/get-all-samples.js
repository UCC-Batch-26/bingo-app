import { Sample } from '#modules/samples/models/sample.js';
import { log } from '#utils/log.js';

export async function getAllSamples(req, res) {
  try {
    const allSamples = await Sample.find({});

    return res.status(200).json({
      data: allSamples,
    });
  } catch (error) {
    log('getAllSamples', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong retrieving all samples',
    });
  }
}
