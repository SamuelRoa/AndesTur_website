const API_BASE = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL || "";

async function request(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  const url = `${API_BASE}${endpoint}`;
  const config = { headers, ...options };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!data.success) {
    const errorMessages = data.errors
      ? data.errors.map((e) => `${e.field ? e.field + ": " : ""}${e.message}`).join(" | ")
      : null;
    const message = errorMessages || data.message || "Error en la solicitud";
    console.error("API Error:", url, message, data.errors || data);
    throw new Error(message);
  }

  return data;
}

export function getDestinations() {
  return request("/api/destinations?active=true");
}

export function createPreReservation(payload) {
  return request("/api/reservations/pre-reservation", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPackages() {
  return request("/api/packages");
}

export function getReservation(id) {
  return request(`/api/reservations/${id}`);
}

export function queryReservations(email, dni) {
  return request("/api/reservations/query", {
    method: "POST",
    body: JSON.stringify({ email, dni }),
  });
}

export function initiatePayment(payload) {
  return request("/api/payments/initiate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPaymentSummary(idReservation) {
  return request(`/api/payments/${idReservation}`);
}

export function payAfterPreReservation(idReservation, payload, receiptFile = null) {
  if (receiptFile) {
    const formData = new FormData();
    formData.append("receipt", receiptFile);
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, val);
    });
    const url = `${API_BASE}/api/reservations/${idReservation}/pay`;
    return fetch(url, { method: "POST", body: formData }).then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        const msg = data.errors?.[0]?.message || data.message || "Error en el pago";
        throw new Error(msg);
      }
      return data;
    });
  }
  return request(`/api/reservations/${idReservation}/pay`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
