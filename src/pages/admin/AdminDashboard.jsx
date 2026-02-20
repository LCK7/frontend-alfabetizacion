import { useState, useEffect } from "react";
import api from "../../api/api";

import CourseForm from "./CourseForm";
import LessonForm from "./LessonForm";
import ExamForm from "./ExamForm";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [mlPredictions, setMlPredictions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCourses();
    loadPredictions();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse.id);
      loadExams(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadPredictions = async () => {
    try {
      const res = await api.get("/ml/predict-all");
      setMlPredictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRiskClass = (prob) => {
    if (prob > 0.7) return "alto";
    if (prob > 0.4) return "medio";
    return "bajo";
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, courseData, {
          headers: { Authorization: token },
        });
      } else {
        await api.post("/courses", courseData, {
          headers: { Authorization: token },
        });
      }
      loadCourses();
      setShowCourseForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("¿Eliminar curso?")) return;
    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: token },
      });
      loadCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLessons = async (courseId) => {
    try {
      const response = await api.get("/lessons", {
        params: { courseId },
      });
      setLessons(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrEditLesson = async (lessonData) => {
    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, lessonData, {
          headers: { Authorization: token },
        });
      } else {
        await api.post(
          "/lessons",
          { ...lessonData, courseId: selectedCourse.id },
          { headers: { Authorization: token } }
        );
      }
      loadLessons(selectedCourse.id);
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("¿Eliminar lección?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`, {
        headers: { Authorization: token },
      });
      loadLessons(selectedCourse.id);
    } catch (error) {
      console.error(error);
    }
  };

  const loadExams = async (courseId) => {
    try {
      const response = await api.get(`/exams/course/${courseId}`);
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateExam = async (examData) => {
    try {
      await api.post("/exams", examData, {
        headers: { Authorization: token },
      });
      loadExams(selectedCourse.id);
      setShowExamForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administrador</h1>

      <div className="ml-panel">
        <h2>🧠 Riesgo de abandono (IA)</h2>

        {mlPredictions.length === 0 ? (
          <p className="empty">No hay predicciones</p>
        ) : (
          <div className="ml-grid">
            {mlPredictions
              .sort((a, b) => b.probabilidadAbandono - a.probabilidadAbandono)
              .map((user) => (
                <div
                  key={user.userId}
                  className={`ml-card ${getRiskClass(
                    user.probabilidadAbandono
                  )}`}
                >
                  <h4>{user.name}</h4>
                  <p>Progreso: {(user.progreso * 100).toFixed(0)}%</p>
                  <p>Días inactivo: {user.diasInactivo}</p>
                  <p>Promedio examen: {user.promedioExamen.toFixed(1)}</p>
                  <div className="probabilidad">
                    {(user.probabilidadAbandono * 100).toFixed(1)}% riesgo
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="dashboard-container">
        <div className="courses-panel">
          <div className="panel-header">
            <h2>Cursos</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingCourse(null);
                setShowCourseForm(!showCourseForm);
              }}
            >
              {showCourseForm ? "Cancelar" : "+ Nuevo Curso"}
            </button>
          </div>

          {showCourseForm && (
            <CourseForm
              onSubmit={handleCreateCourse}
              initialData={editingCourse}
            />
          )}

          {loading ? (
            <p className="loading">Cargando cursos...</p>
          ) : courses.length === 0 ? (
            <p className="empty">No hay cursos</p>
          ) : (
            <div className="courses-list">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card ${
                    selectedCourse?.id === course.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3>{course.title}</h3>
                  <p className="course-level">Nivel: {course.level}</p>
                  <p className="course-description">{course.description}</p>
                  <div className="course-actions">
                    <button
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCourse(course);
                        setShowCourseForm(true);
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCourse && (
          <div className="lessons-panel">
            <div className="panel-header">
              <h2>Lecciones de: {selectedCourse.title}</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingLesson(null);
                  setShowLessonForm(!showLessonForm);
                }}
              >
                {showLessonForm ? "Cancelar" : "+ Nueva Lección"}
              </button>
            </div>

            {showLessonForm && (
              <LessonForm
                onSubmit={handleCreateOrEditLesson}
                initialData={editingLesson}
              />
            )}

            {lessons.length === 0 ? (
              <p className="empty">No hay lecciones</p>
            ) : (
              <div className="lessons-list">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="lesson-card">
                    <div className="lesson-content">
                      <h4>{lesson.title}</h4>
                      <p className="lesson-order">Orden: {lesson.order}</p>
                      {lesson.content && (
                        <p className="lesson-description">{lesson.content}</p>
                      )}
                      {lesson.video_url && (
                        <p className="lesson-video">
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver video
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="lesson-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingLesson(lesson);
                          setShowLessonForm(true);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedCourse && (
          <div className="exams-panel">
            <div className="panel-header">
              <h2>Exámenes de: {selectedCourse.title}</h2>
              <button
                className="btn-primary"
                onClick={() => setShowExamForm(!showExamForm)}
              >
                {showExamForm ? "Cancelar" : "+ Nuevo Examen"}
              </button>
            </div>

            {showExamForm && (
              <ExamForm
                onSubmit={handleCreateExam}
                selectedCourse={selectedCourse}
                lessons={lessons}
              />
            )}

            {exams.length === 0 ? (
              <p className="empty">No hay exámenes</p>
            ) : (
              <div className="exams-list">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <p>
                      <strong>Pregunta:</strong> {exam.question}
                    </p>
                    <p>A: {exam.option_a}</p>
                    <p>B: {exam.option_b}</p>
                    <p>C: {exam.option_c}</p>
                    <p>Correcta: {exam.correct_option?.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}