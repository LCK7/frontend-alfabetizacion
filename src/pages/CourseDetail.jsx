import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { completeLesson, getMyProgress } from "../api/progress";
import { listExamsByLesson } from "../api/exams";
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

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        // si el usuario está logueado, obtener su progreso y marcar lecciones completadas
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const pr = await getMyProgress();
            const ids = new Set(pr.data.filter((p) => p.completed).map((p) => Number(p.lessonId)));
            setCompletedIds(ids);
          } catch (e) {
            console.warn("No se pudo obtener progreso del usuario", e);
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
  }, [id]);

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
        // fallback
        setCompletedIds((prev) => new Set(prev).add(Number(lessonId)));
      }

      alert("Lección marcada como completada");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el progreso");
    }
  };

  // cuando se selecciona una lección, cargar sus examenes
  useEffect(() => {
    let mounted = true;
    async function loadExams() {
      if (!selected) return setLessonExams([]);
      try {
        const res = await listExamsByLesson(selected);
        if (mounted) setLessonExams(res.data || []);
      } catch (err) {
        console.warn("No se pudieron cargar examenes de la leccion", err);
        if (mounted) setLessonExams([]);
      }
    }
    loadExams();
    return () => (mounted = false);
  }, [selected]);

  if (loading) return <div className="loading">Cargando curso...</div>;
  if (!course) return null;

  return (
    <div className="course-detail container">
      <h1>{course.title}</h1>
      <p className="course-desc">{course.description}</p>

      <div className="lessons-list">
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson) => (
            <div key={lesson.id} className={`lesson-item ${selected === lesson.id ? 'active' : ''}`}>
              <div className="lesson-meta">
                <h3 onClick={() => setSelected(lesson.id)} style={{cursor:'pointer'}}>{lesson.title}</h3>
                <div className="lesson-actions">
                  <button onClick={() => setSelected(lesson.id)} className="btn-small">Ver</button>
                  {completedIds.has(Number(lesson.id)) ? (
                    <button className="btn-small" disabled>Completada ✓</button>
                  ) : (
                    <button onClick={() => handleComplete(lesson.id)} className="btn-small btn-primary">Marcar completada</button>
                  )}
                </div>
              </div>
                  {selected === lesson.id && (
                    <div className="lesson-content">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content || "") }} />
                      {lesson.video_url && (
                        <div className="lesson-video">
                          <a href={lesson.video_url} target="_blank" rel="noreferrer">Ver video relacionado</a>
                        </div>
                      )}
                      {/* cargar examenes asociados a la leccion si existen */}
                      <div className="lesson-exams">
                        <h4>Exámenes relacionados</h4>
                        <ul>
                          {lessonExams.length === 0 ? (<li>No hay exámenes para esta lección</li>) : lessonExams.map((ex) => (
                            <li key={ex.id}>{ex.question}</li>
                          ))}
                        </ul>
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
