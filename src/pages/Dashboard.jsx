import { useState, useEffect } from "react";
import "./Dashboard.css";

export default function Dashboard() {

  // ===================== DATOS SIMULADOS =====================
  const stats = {
    coursesEnrolled: 5,
    coursesCompleted: 2,
    totalProgress: 48,
    hoursLearned: 12,
  };

  const recentCourses = [
    { id: 1, title: "Introducción a la Computación", progress: 80 },
    { id: 2, title: "Uso básico de Internet", progress: 45 },
    { id: 3, title: "Correo electrónico paso a paso", progress: 20 },
  ];

  // ===================== MENSAJES MOTIVACIONALES =====================

  const messages = [
    "🌟 Cada pequeño avance cuenta. ¡Sigue así!",
    "🚀 Estás más cerca de tu meta que ayer.",
    "💡 Aprender algo nuevo cada día cambia tu futuro.",
    "🔥 La constancia vence al talento cuando el talento no es constante.",
    "📚 Tu esfuerzo de hoy es tu conocimiento de mañana.",
    "👏 Excelente progreso, sigue construyendo tu aprendizaje.",
    "🎯 No te detengas ahora, lo estás haciendo muy bien.",
    "✨ Cree en tu proceso, el progreso es real.",
    "💪 La disciplina que tienes hoy será tu éxito mañana.",
  ];

  const [motivation, setMotivation] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    const showRandomMessage = () => {
      const random = messages[Math.floor(Math.random() * messages.length)];
      setMotivation(random);
      setShowMotivation(true);

      setTimeout(() => setShowMotivation(false), 5000);
    };

    const initialDelay = setTimeout(showRandomMessage, 4000);

    const interval = setInterval(showRandomMessage, 18000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Mi Progreso</h1>
      {showMotivation && (
        <div className="motivation-popup">
          <span>{motivation}</span>
          <button onClick={() => setShowMotivation(false)}>✕</button>
        </div>
      )}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.coursesEnrolled}</span>
          <span className="stat-label">Cursos inscritos</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.coursesCompleted}</span>
          <span className="stat-label">Cursos completados</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.totalProgress}%</span>
          <span className="stat-label">Progreso total</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.hoursLearned}</span>
          <span className="stat-label">Horas aprendidas</span>
        </div>
      </div>
      <div className="progress-section">
        <h2>Progreso general</h2>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.totalProgress}%` }}
          />
        </div>

        <p className="progress-text">
          Has completado el {stats.totalProgress}% de tu aprendizaje
        </p>
      </div>
      <div className="courses-section">
        <h2>Cursos en progreso</h2>

        <div className="courses-list">
          {recentCourses.map((course) => (
            <div key={course.id} className="course-progress-card">
              <div className="course-info">
                <h3>{course.title}</h3>
                <span>{course.progress}%</span>
              </div>

              <div className="mini-progress-bar">
                <div
                  className="mini-progress-fill"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
