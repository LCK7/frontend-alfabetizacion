import api from "./api";

/**
 * CURSOS
 */

export async function getCourses() {
  const res = await api.get("/courses");
  return res.data;
}

export async function getCourseById(courseId) {
  const res = await api.get(`/courses/${courseId}`);
  return res.data;
}

export async function createCourse(payload) {
  const token = localStorage.getItem("token");
  const res = await api.post("/courses", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateCourse(courseId, payload) {
  const token = localStorage.getItem("token");
  const res = await api.put(`/courses/${courseId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteCourse(courseId) {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/courses/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

/**
 * LECCIONES
 */

export async function getLessons(courseId) {
  const res = await api.get("/lessons", {
    params: { courseId }
  });
  return res.data;
}

export async function getLessonsByCourse(courseId) {
  const res = await api.get("/lessons", {
    params: { courseId }
  });
  return res.data;
}

export async function getLessonById(lessonId) {
  const res = await api.get(`/lessons/${lessonId}`);
  return res.data;
}

export async function createLesson(courseId, payload) {
  const token = localStorage.getItem("token");
  const res = await api.post("/lessons", {
    ...payload,
    CourseId: courseId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateLesson(lessonId, payload) {
  const token = localStorage.getItem("token");
  const res = await api.put(`/lessons/${lessonId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteLesson(lessonId) {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/lessons/${lessonId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessons,
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
