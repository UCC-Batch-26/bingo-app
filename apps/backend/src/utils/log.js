import debug from 'debug';

export function log(namespace = 'log', ...message) {
  const _log = debug(`backend:${namespace}`);

  return _log(...message);
}
