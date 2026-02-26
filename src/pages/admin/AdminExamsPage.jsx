import { useState, useEffect } from "react";
import * as examApi from "../../api/exams";
import * as courseApi from "../../api/courses";
import ExamForm from "./ExamForm";
import "./AdminExamsPage.css";

export default function AdminExamsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [exams, setExams] = useState([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadExams(selectedCourse.id);
      loadLessons(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses();
      console.log("Cursos cargados:", response);
      setCourses(Array.isArray(response) ? response : []);
      // Seleccionar el primer curso automáticamente
      if (Array.isArray(response) && response.length > 0) {
        setSelectedCourse(response[0]);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async (courseId) => {
    try {
      console.log('🔄 [loadExams] Recargando exámenes para curso:', courseId);
      const response = await examApi.listExamsByCourse(courseId);
      console.log('✅ [loadExams] Response del API:', response);
      console.log('✅ [loadExams] Es array?', Array.isArray(response));
      if (Array.isArray(response)) {
        console.log('✅ [loadExams] Total exámenes cargados:', response.length);
        response.forEach((exam, idx) => {
          console.log(`  [${idx}] ID: ${exam.id}, Pregunta: "${exam.question.substring(0, 40)}", Respuesta correcta: "${exam.correctAnswer}"`);
        });
      }
      setExams(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('❌ [loadExams] Error al cargar exámenes:', error);
      console.error('❌ [loadExams] Error message:', error.message);
      console.error('❌ [loadExams] Response data:', error.response?.data);
      setExams([]);
    }
  };

  const loadLessons = async (courseId) => {
    try {
      const response = await courseApi.getLessonsByCourse(courseId);
      console.log("Lecciones cargadas:", response);
      setLessons(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error al cargar lecciones:", error);
      setLessons([]);
    }
  };

  const handleCreateExam = async (examData) => {
    try {
      if (editingExam) {
        await examApi.updateExam(editingExam.id, examData);
        console.log("Examen actualizado");
      } else {
        await examApi.createExam(examData);
        console.log("Examen creado");
      }
      loadExams(selectedCourse.id);
      setShowExamForm(false);
      setEditingExam(null);
    } catch (err) {
      console.error("Error al crear/editar examen:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este examen?")) {
      return;
    }
    try {
      await examApi.deleteExam(examId);
      loadExams(selectedCourse.id);
    } catch (err) {
      console.error("Error al eliminar examen:", err);
      alert("Error al eliminar examen");
    }
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setShowExamForm(true);
  };

  const handleCloseForm = () => {
    console.log('🔄 [handleCloseForm] Cerrando formulario y recargando exámenes');
    setShowExamForm(false);
    setEditingExam(null);
    // Recargar exámenes después de guardar/editar
    if (selectedCourse) {
      loadExams(selectedCourse.id);
    }
  };

  return (
    <div className="admin-exams-page">
      <h1>Administración de Exámenes</h1>

      {/* Selector de Curso */}
      <div className="exams-header">
        <div className="course-selector">
          <label htmlFor="course-select">Seleccionar Curso:</label>
          <select
            id="course-select"
            value={selectedCourse?.id || ""}
            onChange={(e) => {
              const course = courses.find((c) => c.id === Number(e.target.value));
              setSelectedCourse(course);
            }}
            className="course-select-input"
          >
            <option value="">-- Seleccionar un curso --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingExam(null);
              setShowExamForm(!showExamForm);
            }}
          >
            {showExamForm ? "✕ Cancelar" : "+ Crear Nuevo Examen"}
          </button>
        )}
      </div>

      {!selectedCourse && (
        <p className="empty-state">
          Selecciona un curso para comenzar a administrar exámenes
        </p>
      )}

      {selectedCourse && (
        <div className="exams-container">
          {/* Form de creación/edición */}
          {showExamForm && (
            <div className="exam-form-section">
              <h2>{editingExam ? "Editar Examen" : "Crear Nuevo Examen"}</h2>
              <ExamForm
                onSubmit={handleCreateExam}
                onSuccess={handleCloseForm}
                selectedCourse={selectedCourse}
                selectedLesson={null}
                editingExam={editingExam}
              />
            </div>
          )}

          {/* Lista de exámenes */}
          <div className="exams-list-section">
            <h2>
              Exámenes de: <strong>{selectedCourse.title}</strong>
            </h2>

            {loading ? (
              <p className="loading">Cargando exámenes...</p>
            ) : exams.length === 0 ? (
              <p className="empty-state">
                No hay exámenes en este curso. ¡Crea uno nuevo!
              </p>
            ) : (
              <div className="exams-grid">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-card-header">
                      <h3 className="exam-question">{exam.question}</h3>
                      {exam.difficulty && (
                        <span
                          className="difficulty-badge"
                          data-difficulty={exam.difficulty}
                        >
                          {exam.difficulty}
                        </span>
                      )}
                    </div>

                    {exam.description && (
                      <p className="exam-description">{exam.description}</p>
                    )}

                    {exam.options && exam.options.length > 0 && (
                      <div className="exam-options-preview">
                        <p className="options-label">Opciones:</p>
                        <ul className="options-list">
                          {exam.options.map((opt, idx) => (
                            <li
                              key={opt.id}
                              className={
                                opt.id === exam.correctAnswer ? "correct" : ""
                              }
                            >
                              <span className="option-letter">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              <span className="option-text">{opt.text}</span>
                              {opt.id === exam.correctAnswer && (
                                <span className="correct-mark">✓</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exam.lessonId && (
                      <p className="exam-lesson">
                        Lección:{" "}
                        <strong>
                          {lessons.find((l) => l.id === exam.lessonId)?.title ||
                            `ID ${exam.lessonId}`}
                        </strong>
                      </p>
                    )}

                    <div className="exam-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditExam(exam)}
                        title="Editar examen"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteExam(exam.id)}
                        title="Eliminar examen"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
