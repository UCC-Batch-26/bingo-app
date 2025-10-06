const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function getData(endpoint) {
  try {
    const response = await fetch(`${API_URL}/v1${endpoint}`);

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Fetch failed');

    return data;
  } catch (error) {
    console.error('ERROR (GET):', error);
    return null;
  }
}

export async function postData(endpoint, payload) {
  try {
    const response = await fetch(`${API_URL}/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'POST failed');

    return data;
  } catch (error) {
    console.error('ERROR (POST):', error);
    return null;
  }
}

export async function patchData(endpoint, payload) {
  try {
    const response = await fetch(`${API_URL}/v1${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'PATCH failed');

    return data;
  } catch (error) {
    console.error('ERROR (PATCH):', error);
    return null;
  }
}
