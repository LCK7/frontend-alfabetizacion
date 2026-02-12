import { useState, useEffect } from "react";
import api from "../api/api";
import { getMyProgress } from "../api/progress";
import "./Dashboard.css";

// Hook para animar un número de forma simple
function useCountUp(target, duration = 700) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = null;
    let start = null;
    const from = 0;
    const to = Number(target) || 0;
    if (to === from) return setVal(to);
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.round(from + (to - from) * progress);
      setVal(current);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function CountCard({ c }) {
  const animated = useCountUp(c.percent, 700);
  return (
    <div key={c.id} className="course-progress-card">
      <div className="course-info">
        <h3>{c.title}</h3>
        <span>{animated}%</span>
      </div>

      <div className="mini-progress-bar">
        <div className="mini-progress-fill" style={{ width: `${animated}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motivation, setMotivation] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [coursesRes] = await Promise.all([api.get("/courses")]);
        setCourses(coursesRes.data || []);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const pr = await getMyProgress();
            setProgress(pr.data || []);
          } catch (e) {
            console.warn("No se pudo cargar el progreso del usuario", e);
            setProgress([]);
          }
        } else {
          setProgress([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // mensajes motivacionales periódicos
    const messages = [
      "🌟 Cada pequeño avance cuenta. ¡Sigue así!",
      "🚀 Estás más cerca de tu meta que ayer.",
      "💡 Repite una lección si lo necesitas — está bien tomarse tiempo.",
      "👏 ¡Buen trabajo! Un paso a la vez.",
    ];

    let intervalId = null;
    const showRandom = () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setMotivation(msg);
      setShowMotivation(true);
      // ocultar suavemente después de 5.5s
      setTimeout(() => setShowMotivation(false), 5500);
    };

    // mostrar una vez al inicio con pequeño delay
    const initial = setTimeout(showRandom, 1500);
    intervalId = setInterval(showRandom, 20000);

    return () => {
      clearTimeout(initial);
      clearInterval(intervalId);
    };
  }, []);

  // (useCountUp moved above)

  // calcular progreso por curso
  const courseProgress = courses.map((c) => {
    const total = (c.lessons && c.lessons.length) || 0;
    const completed = progress.filter((p) => {
      // p.lessonId puede ser número o string
      return c.lessons && c.lessons.some((l) => Number(l.id) === Number(p.lessonId));
    }).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { id: c.id, title: c.title, total, completed, percent };
  });

  const totalLessons = courseProgress.reduce((s, c) => s + c.total, 0);
  const totalCompleted = courseProgress.reduce((s, c) => s + c.completed, 0);
  const overall = totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100);

  const overallAnimated = useCountUp(overall, 900);

  if (loading) return <div className="loading">Cargando progreso...</div>;

  return (
    <div className="dashboard container">
      <h1 className="dashboard-title">Mi Progreso</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{courses.length}</span>
          <span className="stat-label">Cursos disponibles</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{courseProgress.filter((c) => c.percent === 100).length}</span>
          <span className="stat-label">Cursos completados</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{overallAnimated}%</span>
          <span className="stat-label">Progreso total</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{totalCompleted}</span>
          <span className="stat-label">Lecciones completadas</span>
        </div>
      </div>

      <div className="progress-section">
        <h2>Progreso general</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${overallAnimated}%` }} />
        </div>
        <p className="progress-text">Has completado el {overallAnimated}% de tu aprendizaje</p>
      </div>

      <div className="courses-section">
        <h2>Cursos</h2>
        <div className="courses-list">
          {courseProgress.map((c) => (
            <CountCard key={c.id} c={c} />
          ))}
        </div>
      </div>

      <div className={`motivation-popup ${showMotivation ? 'show' : 'hide'}`}>
        <span>{motivation}</span>
        <button onClick={() => setShowMotivation(false)}>✕</button>
      </div>
    </div>
  );
}
