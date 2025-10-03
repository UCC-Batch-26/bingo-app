
const BASE_URL = 'http://localhost:3000/v1';

async function handleResponse(res) {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data?.message || JSON.stringify(data) || res.statusText);
    console.log('Response Data:', data);
    return data;
  } catch (e) {
    if (!res.ok) throw new Error(text || res.statusText);
    return text;
  }
}

