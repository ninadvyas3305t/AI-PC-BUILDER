const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export function fetchComponents(category) {
  return request(`/api/components/${category}`);
}

export function checkCompatibility(components) {
  return request('/api/builds/check-compatibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ components }),
  });
}
