import { Sample } from '#modules/samples/models/sample.js';
import { log } from '#utils/log.js';

export async function addSample(req, res) {
  try {
    const { name } = req.body;
    const sample = await Sample.create({ name });

    return res.status(201).json({
      message: 'Successfully created sample',
      data: sample,
    });
  } catch (error) {
    log('addSample', 'Error creating sample:', error);

    return res.status(400).json({
      message: error?.message ?? 'Something went wrong creating sample',
    });
  }
}
