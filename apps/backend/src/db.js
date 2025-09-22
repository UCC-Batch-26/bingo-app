import { log } from '#utils/log.js';
import { connect } from 'mongoose';

export async function db(uri) {
  try {
    log('db', 'Successfully connected to the database');
    await connect(uri);
  } catch (error) {
    log('db', 'Failed to connect to the database', error);
  }
}
