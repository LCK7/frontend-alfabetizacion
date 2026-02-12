import api from "./api";

export async function createExam(payload) {
  const token = localStorage.getItem("token");
  return api.post("/exams", payload, { headers: { Authorization: token } });
}

export async function listExamsByCourse(courseId) {
  return api.get(`/exams/course/${courseId}`);
}

export async function listExamsByLesson(lessonId) {
  return api.get(`/exams/lesson/${lessonId}`);
}

export default { createExam, listExamsByCourse, listExamsByLesson };
