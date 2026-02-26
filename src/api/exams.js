import api from "./api";

export async function getExamById(examId) {
  const res = await api.get(`/exams/${examId}`);
  return res.data;
}

export async function listExamsByCourse(courseId) {
  const res = await api.get(`/exams/course/${courseId}`);
  return res.data;
}

export async function listExamsByLesson(lessonId) {
  const res = await api.get(`/exams/lesson/${lessonId}`);
  return res.data;
}

export async function createExam(payload) {
  const token = localStorage.getItem("token");
  const res = await api.post("/exams", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function createExamsBatch(exams) {
  const token = localStorage.getItem("token");
  const res = await api.post("/exams/batch/create", { exams }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateExam(examId, payload) {
  const token = localStorage.getItem("token");
  const res = await api.put(`/exams/${examId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}


export async function deleteExam(examId) {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/exams/${examId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}


export async function saveExamResult(examId, selectedAnswer, timeSpent) {
  const token = localStorage.getItem("token");
  const res = await api.post("/exams/results", {
    examId: Number(examId),
    selectedAnswer,
    timeSpent: timeSpent ? Number(timeSpent) : null
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// ============ VALIDACIÓN (Autoevaluación Local) ============

export async function validateAnswer(examId, selectedAnswer) {
  const token = localStorage.getItem("token");
  const res = await api.post("/exams/results/validate", {
    examId: Number(examId),
    selectedAnswer
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getUserResults(userId) {
  const token = localStorage.getItem("token");
  const res = await api.get(`/exams/results/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getExamStatistics(examId) {
  const token = localStorage.getItem("token");
  const res = await api.get(`/exams/stats/${examId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export default {
  getExamById,
  listExamsByCourse,
  listExamsByLesson,
  createExam,
  createExamsBatch,
  updateExam,
  deleteExam,
  validateAnswer,
  getUserResults,
  getExamStatistics
};