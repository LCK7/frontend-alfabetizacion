import { useState, useEffect } from "react";
import api from "../../api/api";
import * as courseApi from "../../api/courses";
import { simplifyLesson } from "../../api/chat";

import CourseForm from "./CourseForm";
import LessonForm from "./LessonForm";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Estados para sugerencias de IA
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiDifficulty, setAiDifficulty] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse.id);
    } else {
      setLessons([]);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses();
      setCourses(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    const token = localStorage.getItem("token");
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, courseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/courses", courseData, {
          headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Eliminar curso?")) return;
    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLessons = async (courseId) => {
    try {
      const response = await courseApi.getLessonsByCourse(courseId);
      setLessons(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
      setLessons([]);
    }
  };

  const handleCreateOrEditLesson = async (lessonData) => {
    const token = localStorage.getItem("token");
    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, lessonData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const payload = { ...lessonData, courseId: selectedCourse.id };
        await api.post("/lessons", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await loadLessons(selectedCourse.id);
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Eliminar lección?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadLessons(selectedCourse.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Funciones para mostrar nivel de dificultad
  const getDifficultyLabel = (complexity) => {
    if (complexity > 0.5) return "Alto";
    if (complexity > 0.25) return "Medio";
    return "Bajo";
  };

  const getDifficultyClass = (complexity) => {
    if (complexity > 0.5) return "alto";
    if (complexity > 0.25) return "medio";
    return "bajo";
  };

  // Función para obtener sugerencias de IA
  const handleGetAISuggestion = async (lesson) => {
    if (!lesson.title || !lesson.content) {
      alert("La lección debe tener título y contenido para generar sugerencias");
      return;
    }

    setLoadingSuggestion(true);
    try {
      const result = await simplifyLesson(lesson.title, lesson.content);
      
      if (result.error) {
        alert("Error al generar sugerencias: " + result.error);
        return;
      }

      setAiSuggestion(result.suggestion);
      setAiDifficulty(result.difficulty);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      alert("Error al generar sugerencias de IA");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  // Función para obtener color según porcentaje
  const getDifficultyColor = (percentage) => {
    if (percentage <= 30) return "#10b981"; // verde
    if (percentage <= 60) return "#f59e0b"; // amarillo
    return "#ef4444"; // rojo
  };

  // Función para obtener etiqueta de dificultad
  const getDifficultyLabelFromPercentage = (percentage) => {
    if (percentage <= 30) return "Fácil";
    if (percentage <= 60) return "Moderado";
    return "Difícil";
  };

  // Función para copiar sugerencia al portapapeles
  const handleCopySuggestion = async () => {
    if (!aiSuggestion) return;
    
    try {
      await navigator.clipboard.writeText(aiSuggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = aiSuggestion;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Función para manejar la selección de lección
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setEditingLesson(lesson); // También establece editingLesson para compatibilidad
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administrador</h1>

      <div className="dashboard-container" style={{ display: "flex", gap: "1rem" }}>
        {/* PANEL DE CURSOS */}
        <div className="courses-panel" style={{ flex: 1 }}>
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

        {/* PANEL DE LECCIONES + SUGERENCIAS */}
        {selectedCourse && (
          <div style={{ flex: 2, display: "flex", gap: "1rem" }}>
            {/* LECCIONES */}
            <div className="lessons-panel" style={{ flex: 2 }}>
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
                    <div
                      key={lesson.id}
                      className={`lesson-card ${
                        selectedLesson?.id === lesson.id ? "selected" : ""
                      } ${
                        editingLesson?.id === lesson.id ? "editing" : ""
                      }`}
                    >
                      <div
                        className="lesson-content"
                        onClick={() => handleSelectLesson(lesson)}
                      >
                        <div className="lesson-header">
                          <h4>{lesson.title}</h4>
                          {selectedLesson?.id === lesson.id && (
                            <span className="selected-indicator">✓</span>
                          )}
                        </div>
                        <p className="lesson-order">Orden: {lesson.order}</p>
                        {lesson.content && (
                          <p className="lesson-description">{lesson.content}</p>
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

            {/* PANEL LATERAL DE SUGERENCIAS */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              {editingLesson ? (
                <div className="ai-suggestions-panel">
                  <div className="suggestions-header">
                    <h3>🤖 Análisis de IA</h3>
                    <button
                      className="btn-ai-analyze"
                      onClick={() => handleGetAISuggestion(editingLesson)}
                      disabled={loadingSuggestion}
                    >
                      {loadingSuggestion ? "⏳ Analizando..." : "🔍 Analizar"}
                    </button>
                  </div>

                  {aiDifficulty && (
                    <div className="difficulty-analysis">
                      <h4>📊 Nivel de Dificultad</h4>
                      
                      <div className="difficulty-item">
                        <div className="difficulty-label">
                          <span>Técnica</span>
                          <span className="difficulty-percentage">
                            {aiDifficulty.dificultad_tecnica}%
                          </span>
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="difficulty-fill"
                            style={{
                              width: `${aiDifficulty.dificultad_tecnica}%`,
                              backgroundColor: getDifficultyColor(aiDifficulty.dificultad_tecnica)
                            }}
                          />
                        </div>
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(aiDifficulty.dificultad_tecnica) }}
                        >
                          {getDifficultyLabelFromPercentage(aiDifficulty.dificultad_tecnica)}
                        </span>
                      </div>

                      <div className="difficulty-item">
                        <div className="difficulty-label">
                          <span>Comprensión</span>
                          <span className="difficulty-percentage">
                            {aiDifficulty.dificultad_comprension}%
                          </span>
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="difficulty-fill"
                            style={{
                              width: `${aiDifficulty.dificultad_comprension}%`,
                              backgroundColor: getDifficultyColor(aiDifficulty.dificultad_comprension)
                            }}
                          />
                        </div>
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(aiDifficulty.dificultad_comprension) }}
                        >
                          {getDifficultyLabelFromPercentage(aiDifficulty.dificultad_comprension)}
                        </span>
                      </div>

                      {aiDifficulty.razonamiento && (
                        <div className="difficulty-reasoning">
                          <strong>📝 Análisis:</strong>
                          <p>{aiDifficulty.razonamiento}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {aiSuggestion && (
                    <div className="ai-suggestion">
                      <div className="suggestion-header">
                        <h4>💡 Sugerencia de Mejora</h4>
                        <button
                          className="btn-copy-suggestion"
                          onClick={handleCopySuggestion}
                          disabled={!aiSuggestion}
                        >
                          {copied ? "✅ Copiado" : "📋 Copiar"}
                        </button>
                      </div>
                      <div className="suggestion-content">
                        {aiSuggestion.split('\n').map((line, index) => (
                          <div key={index} className="suggestion-line">
                            {line || <br />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!loadingSuggestion && !aiSuggestion && !aiDifficulty && (
                    <div className="no-suggestions">
                      <p>📋 Haz clic en "Analizar" para obtener sugerencias de IA</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-lesson-selected">
                  <p>📚 Selecciona una lección para ver sugerencias</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}