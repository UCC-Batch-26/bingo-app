import { useCallback } from 'react';
import { useReducer } from 'react';

const PING_URL = `${import.meta.env.VITE_BACKEND_URL}/ping`;

const STATUS_TYPE = {
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
};

export function usePing() {
  // https://youtube.com/shorts/F5cBad7_Bd0?si=9by0zqHBX1Fj6zR4
  const [status, setStatus] = useReducer((current, update) => ({
    ...current,
    ...update,
  }));

  async function ping() {
    setStatus({ status: STATUS_TYPE.PENDING });
    try {
      const response = await fetch(PING_URL);

      if (!response.ok) {
        throw new Error('Unable to connect');
      }

      setStatus({ status: STATUS_TYPE.SUCCESS });
    } catch {
      setStatus({ status: STATUS_TYPE.FAILED });
    }
  }

  return {
    ping: useCallback(ping, []),
    ...status,
  };
}
