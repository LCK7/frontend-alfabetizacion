import api from "./api";

export async function completeLesson(lessonId) {
  const token = localStorage.getItem("token");
  return api.post(
    "/progress/complete",
    { lessonId },
    { headers: { Authorization: token } }
  );
}

export async function getMyProgress() {
  const token = localStorage.getItem("token");
  return api.get("/progress/my", { headers: { Authorization: token } });
}

export default { completeLesson };
