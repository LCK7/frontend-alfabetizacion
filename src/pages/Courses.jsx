import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
      setError("");
    } catch (err) {
      setError("Error al cargar los cursos");
      console.error("Error cargando cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = (courseId) => {
    if (!localStorage.getItem("token")) {
      alert("Debes iniciar sesión para acceder al curso");
      navigate("/login");
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleAdminAccess = () => {
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      alert("Solo los administradores pueden acceder a esta sección");
    }
  };

  return (
    <div className="courses-page">
      {/* Admin Banner - Solo si es admin */}
      {userRole === "admin" && (
        <div className="admin-banner">
          <div className="banner-content">
            <h3>👨‍💼 Panel de Administrador</h3>
            <p>Puedes crear y gestionar cursos desde aquí</p>
            <button onClick={handleAdminAccess} className="btn-admin-access">
              Ir al Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="courses-hero">
        <div className="hero-content">
          <h1>📚 Cursos Disponibles</h1>
          <p>
            Elige un curso y comienza a aprender paso a paso. Puedes acceder sin registrarte,
            pero si creas una cuenta podrás guardar tu progreso.
          </p>
          {userName && (
            <div className="user-info">
              <p>Bienvenido, <strong>{userName}</strong> 👋</p>
            </div>
          )}
        </div>
      </section>

      {/* Cursos */}
      <section className="courses-section">
        {loading ? (
          <div className="loading">Cargando cursos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <p>📭 No hay cursos disponibles aún</p>
            <p className="subtitle">Vuelve pronto para nuevos contenidos</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="course-card"
                onClick={() => setSelectedCourse(selectedCourse?.id === course.id ? null : course)}
              >
                <div className="course-header">
                  <div className="course-badge">{course.level}</div>
                  <h2>{course.title}</h2>
                </div>

                <p className="course-description">{course.description}</p>

                {course.Lessons && course.Lessons.length > 0 && (
                  <div className="course-stats">
                    <span className="stat">
                      📖 {course.Lessons.length} lecciones
                    </span>
                  </div>
                )}

                {selectedCourse?.id === course.id && course.Lessons && course.Lessons.length > 0 && (
                  <div className="lessons-preview">
                    <h4>Lecciones incluidas:</h4>
                    <ul>
                      {course.Lessons.slice(0, 3).map((lesson) => (
                        <li key={lesson.id}>
                          <span>✓</span> {lesson.title}
                        </li>
                      ))}
                      {course.Lessons.length > 3 && (
                        <li className="more-lessons">+ {course.Lessons.length - 3} lecciones más</li>
                      )}
                    </ul>
                  </div>
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnrollCourse(course.id);
                  }}
                  className="btn-enroll"
                >
                  Acceder al Curso →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Banner */}
      {!userRole && (
        <section className="info-banner">
          <div className="banner-wrapper">
            <h3>¿Quieres guardar tu progreso?</h3>
            <p>Crea una cuenta para seguir tu avance en los cursos</p>
            <Link to="/register" className="btn-register-banner">
              Registrarse Gratis →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
