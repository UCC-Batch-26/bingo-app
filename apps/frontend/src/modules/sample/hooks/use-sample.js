import { useCallback, useReducer } from 'react';

const STATE_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};
const ACTION_TYPE = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const initialState = {
  status: STATE_STATUS.IDLE,
  data: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.PENDING:
      return {
        ...state,
        ...initialState,
        status: STATE_STATUS.PENDING,
      };

    case ACTION_TYPE.SUCCESS:
      return {
        ...state,
        status: STATE_STATUS.SUCCESS,
        data: action.payload,
      };

    case ACTION_TYPE.FAILED:
      return {
        ...state,
        status: STATE_STATUS.FAILED,
        data: action.payload,
      };

    default:
      return state;
  }
}

const SAMPLE_URL = `${import.meta.env.VITE_BACKEND_URL}/sample`;

export function useSample() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function addSample(name) {
    dispatch({ type: ACTION_TYPE.PENDING });
    try {
      const response = await fetch(SAMPLE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to request: ${response.status}`);
      }

      dispatch({ type: ACTION_TYPE.SUCCESS, payload: await response.json() });
    } catch (error) {
      console.log('Failed Adding Sample Request:', error);
      dispatch({ type: ACTION_TYPE.FAILED, payload: error?.message ?? 'Something went wrong' });
    }
  }

  async function allSamples() {
    dispatch({ type: ACTION_TYPE.PENDING });
    try {
      const response = await fetch(SAMPLE_URL);

      if (!response.ok) {
        throw new Error(`Failed to request: ${response.status}`);
      }

      const { data } = await response.json();

      dispatch({ type: ACTION_TYPE.SUCCESS, payload: data });
    } catch (error) {
      console.log('Failed Getting All Sample Request:', error);
      dispatch({ type: ACTION_TYPE.FAILED, payload: error?.message ?? 'Something went wrong' });
    }
  }

  async function viewSample(id) {
    dispatch({ type: ACTION_TYPE.PENDING });
    try {
      const response = await fetch(`${SAMPLE_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to request: ${response.status}`);
      }

      dispatch({ type: ACTION_TYPE.SUCCESS, payload: await response.json() });
    } catch (error) {
      console.log('Failed Getting Sample Request:', error);
      dispatch({ type: ACTION_TYPE.FAILED, payload: error?.message ?? 'Something went wrong' });
    }
  }

  return {
    addSample: useCallback(addSample, []),
    allSamples: useCallback(allSamples, []),
    viewSample: useCallback(viewSample, []),
    isPending: state.status === STATE_STATUS.PENDING,
    isSuccess: state.status === STATE_STATUS.SUCCESS,
    isFailed: state.status === STATE_STATUS.FAILED,
    ...state,
  };
}
