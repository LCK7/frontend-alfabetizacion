import api from "./api";

export async function createExam(payload) {
  const token = localStorage.getItem("token");
  const res = await api.post("/exams", payload, {
    headers: { Authorization: token }
  });
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

export default {
  createExam,
  listExamsByCourse,
  listExamsByLesson
};
