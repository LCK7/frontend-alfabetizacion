import api from "./api";

export async function sendChatMessage(message, history = []) {
  const payload = { message, history };
  try {
    const res = await api.post("/ai/chat", payload);
    if (res?.data?.error) return { error: res.data.error };
    return res.data;
  } catch (err) {
    let msg = "Error de red o conexión";
    if (err?.response) {
      const status = err.response.status;
      const bodyErr = err.response.data?.error || err.response.data || err.response.statusText;
      msg = `HTTP ${status}: ${bodyErr}`;
    } else if (err?.request) {
      msg = "No se recibió respuesta del servidor.";
    } else if (err?.message) {
      msg = err.message;
    }
    return { error: msg };
  }
}

export default sendChatMessage;
