import api from "./api";

export async function sendChatMessage(message, history = []) {
  const payload = { message, history };
  const res = await api.post("/ai/chat", payload);
  return res.data;
}

export default sendChatMessage;
