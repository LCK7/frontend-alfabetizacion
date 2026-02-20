import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { completeLesson, getMyProgress } from "../api/progress";
import { listExamsByLesson } from "../api/exams";
import LessonExam from "../components/LessonExam";
import DOMPurify from "dompurify";
import "./CourseDetail.css";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [lessonExams, setLessonExams] = useState([]);

  /* =========================
     CARGAR CURSO
  ==========================*/
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const pr = await getMyProgress();
            const ids = new Set(
              pr.data
                .filter((p) => p.completed)
                .map((p) => Number(p.lessonId))
            );
            setCompletedIds(ids);
          } catch (e) {
            console.warn(e);
          }
        }

        setLessonExams([]);

      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el curso");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate]);

  /* =========================
     MARCAR LECCION COMPLETADA
  ==========================*/
  const handleComplete = async (lessonId) => {
    if (!localStorage.getItem("token")) {
      if (confirm("Debes iniciar sesión para guardar tu progreso. ¿Ir a Ingresar?")) {
        navigate("/login");
      }
      return;
    }

    try {
      const res = await completeLesson(lessonId);
      const saved = res?.data?.progress;

      if (saved && saved.lessonId) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.add(Number(saved.lessonId));
          return next;
        });
      } else {
        setCompletedIds((prev) => new Set(prev).add(Number(lessonId)));
      }

      alert("Lección marcada como completada");

    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el progreso");
    }
  };

  /* =========================
     CARGAR EXAMENES DE LECCION
  ==========================*/
  useEffect(() => {
    let mounted = true;

    async function loadExams() {
      if (!selected) {
        setLessonExams([]);
        return;
      }

      try {
        const data = await listExamsByLesson(selected);
        if (mounted) setLessonExams(data || []);
      } catch (err) {
        console.warn(err);
        if (mounted) setLessonExams([]);
      }
    }

    loadExams();
    return () => (mounted = false);
  }, [selected]);

  /* =========================
     RENDER
  ==========================*/
  if (loading) return <div className="loading">Cargando curso...</div>;
  if (!course) return null;

  return (
    <div className="course-detail container">

      <h1>{course.title}</h1>
      <p className="course-desc">{course.description}</p>

      <div className="lessons-list">

        {course.lessons?.length > 0 ? (
          course.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-item ${selected === lesson.id ? "active" : ""}`}
            >

              <div className="lesson-meta">

                <h3 onClick={() => setSelected(lesson.id)}>
                  {lesson.title}
                </h3>

                <div className="lesson-actions">

                  <button
                    onClick={() => setSelected(lesson.id)}
                    className="btn-small"
                  >
                    Ver
                  </button>

                  {completedIds.has(Number(lesson.id)) ? (
                    <button className="btn-small" disabled>
                      Completada ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleComplete(lesson.id)}
                      className="btn-small btn-primary"
                    >
                      Marcar completada
                    </button>
                  )}

                </div>
              </div>

              {/* =====================
                 CONTENIDO LECCION
              ======================*/}
              {selected === lesson.id && (
                <div className="lesson-content">

                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(lesson.content || "")
                    }}
                  />

                  {lesson.video_url && (
                    <div className="lesson-video">
                      <a href={lesson.video_url} target="_blank" rel="noreferrer">
                        Ver video relacionado
                      </a>
                    </div>
                  )}

                  {/* =====================
                     EXAMEN PRO
                  ======================*/}
                  <div className="lesson-exams">

                    <div className="lesson-exam-header">
                      <h4>Evaluación de la lección</h4>

                      {lessonExams.length > 0 && (
                        <span className="exam-count">
                          {lessonExams.length} pregunta{lessonExams.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="lesson-exam-body">
                      <LessonExam exams={lessonExams} />
                    </div>

                  </div>

                </div>
              )}

            </div>
          ))
        ) : (
          <p>No hay lecciones en este curso.</p>
        )}

      </div>
    </div>
  );
}