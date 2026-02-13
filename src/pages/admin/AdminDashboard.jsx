import { useState, useEffect } from "react";
import api from "../../api/api";
import { listExamsByCourse } from "../../api/exams";

import CourseForm from "./CourseForm";
import LessonForm from "./LessonForm";
import ExamForm from "./ExamForm";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
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
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse.id);
      loadExams(selectedCourse.id);
    }
  }, [selectedCourse]);

  // --- Cursos ---
  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      alert("Error al cargar los cursos");
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
        alert("Curso actualizado exitosamente");
      } else {
        await api.post("/courses", courseData, {
          headers: { Authorization: token },
        });
        alert("Curso creado exitosamente");
      }
      loadCourses();
      setShowCourseForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el curso");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este curso?")) return;

    try {
      await api.delete(`/courses/${courseId}`, { headers: { Authorization: token } });
      alert("Curso eliminado exitosamente");
      loadCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el curso");
    }
  };

  // --- Lecciones ---
  const loadLessons = async (courseId) => {
    try {
      const response = await api.get("/lessons", { params: { courseId } });
      setLessons(response.data);
    } catch (error) {
      console.error("Error al cargar lecciones:", error);
    }
  };

  const handleCreateOrEditLesson = async (lessonData) => {
    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, lessonData, {
          headers: { Authorization: token },
        });
        alert("Lección actualizada exitosamente");
      } else {
        await api.post("/lessons", { ...lessonData, CourseId: selectedCourse.id }, {
          headers: { Authorization: token },
        });
        alert("Lección creada exitosamente");
      }
      loadLessons(selectedCourse.id);
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la lección");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta lección?")) return;

    try {
      await api.delete(`/lessons/${lessonId}`, { headers: { Authorization: token } });
      alert("Lección eliminada exitosamente");
      loadLessons(selectedCourse.id);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la lección");
    }
  };

  // --- Exámenes ---
  const loadExams = async (courseId) => {
    try {
      const response = await api.get(`/exams/course/${courseId}`);
      setExams(response.data);
    } catch (error) {
      console.error("Error al cargar exámenes:", error);
    }
  };

  const handleCreateExam = async (examData) => {
    try {
      await api.post("/exams", examData, {
        headers: { Authorization: token },
      });
      alert("Examen creado exitosamente");
      loadExams(selectedCourse.id);
      setShowExamForm(false);
    } catch (err) {
      console.error(err);
      alert("Error creando examen");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administrador</h1>

      <div className="dashboard-container">
        {/* Panel de Cursos */}
        <div className="courses-panel">
          <div className="panel-header">
            <h2>Cursos</h2>
            <button className="btn-primary" onClick={() => { setEditingCourse(null); setShowCourseForm(!showCourseForm); }}>
              {showCourseForm ? "Cancelar" : "+ Nuevo Curso"}
            </button>
          </div>

          {showCourseForm && <CourseForm onSubmit={handleCreateCourse} initialData={editingCourse} />}

          {loading ? <p className="loading">Cargando cursos...</p> :
            courses.length === 0 ? <p className="empty">No hay cursos. ¡Crea uno!</p> :
              <div className="courses-list">
                {courses.map((course) => (
                  <div key={course.id} className={`course-card ${selectedCourse?.id === course.id ? "active" : ""}`} onClick={() => setSelectedCourse(course)}>
                    <h3>{course.title}</h3>
                    <p className="course-level">Nivel: {course.level}</p>
                    <p className="course-description">{course.description}</p>
                    <div className="course-actions">
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); setEditingCourse(course); setShowCourseForm(true); }}>✏️ Editar</button>
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>}
        </div>

        {/* Panel de Lecciones */}
        {selectedCourse && (
          <div className="lessons-panel">
            <div className="panel-header">
              <h2>Lecciones de: {selectedCourse.title}</h2>
              <button className="btn-primary" onClick={() => { setEditingLesson(null); setShowLessonForm(!showLessonForm); }}>
                {showLessonForm ? "Cancelar" : "+ Nueva Lección"}
              </button>
            </div>

            {showLessonForm && <LessonForm onSubmit={handleCreateOrEditLesson} initialData={editingLesson} />}

            {lessons.length === 0 ? <p className="empty">No hay lecciones en este curso</p> :
              <div className="lessons-list">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="lesson-card">
                    <div className="lesson-content">
                      <h4>{lesson.title}</h4>
                      <p className="lesson-order">Orden: {lesson.order}</p>
                      {lesson.content && <p className="lesson-description">{lesson.content}</p>}
                      {lesson.video_url && (
                        <p className="lesson-video">
                          Video: <a href={lesson.video_url} target="_blank" rel="noreferrer">{lesson.video_url}</a>
                        </p>
                      )}
                    </div>
                    <div className="lesson-actions">
                      <button className="btn-edit" onClick={() => { setEditingLesson(lesson); setShowLessonForm(true); }}>✏️ Editar</button>
                      <button className="btn-delete" onClick={() => handleDeleteLesson(lesson.id)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>}
          </div>
        )}

        {/* Panel de Exámenes */}
        {selectedCourse && (
          <div className="exams-panel">
            <div className="panel-header">
              <h2>Exámenes de: {selectedCourse.title}</h2>
              <button className="btn-primary" onClick={() => setShowExamForm(!showExamForm)}>
                {showExamForm ? "Cancelar" : "+ Nuevo Examen"}
              </button>
            </div>

            {showExamForm && <ExamForm onSubmit={handleCreateExam} selectedCourse={selectedCourse} />}

            {exams.length === 0 ? <p className="empty">No hay exámenes para este curso</p> :
              <div className="exams-list">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <p><strong>Pregunta:</strong> {exam.question}</p>
                    <p>A: {exam.option_a}</p>
                    <p>B: {exam.option_b}</p>
                    <p>C: {exam.option_c}</p>
                    <p>Correcta: {exam.correct_option?.toUpperCase()}</p>
                  </div>
                ))}
              </div>}
          </div>
        )}
      </div>
    </div>
  );
}
