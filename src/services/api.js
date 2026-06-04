const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const url = `${API_BASE}${endpoint}`;
  const config = { headers, ...options };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!data.success) {
    const message = data.errors?.[0]?.message || data.message || 'Error en la solicitud';
    throw new Error(message);
  }

  return data;
}

export function createPreReservation(payload) {
  return request('/api/reservations/pre-reservation', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getPackages() {
  return request('/api/packages');
}

export function getReservation(id) {
  return request(`/api/reservations/${id}`);
}

export function queryReservations(email, dni) {
  return request('/api/reservations/query', {
    method: 'POST',
    body: JSON.stringify({ email, dni }),
  });
}
