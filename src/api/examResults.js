import api from "./api";

export async function saveExamResult(payload) {
  const token = localStorage.getItem("token");

  return api.post("/exam-results", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
}