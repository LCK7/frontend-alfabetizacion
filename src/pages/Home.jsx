import { Link } from "react-router-dom";
import GuidedTour from "../components/GuidedTour";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <GuidedTour />

      {/* HERO SECTION MEJORADO */}
      <section className="hero hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Aprende Tecnología
            <span className="hero-highlight"> Paso a Paso</span>
          </h1>

          <p className="hero-subtitle">
            Una plataforma diseñada especialmente para adultos mayores.
            Aprende de forma segura y a tu propio ritmo.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Lecciones</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Estudiantes</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Disponible</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explorar Cursos →
            </Link>
            <Link to="/chatbot" className="btn btn-secondary btn-lg">
              Hablar con Asistente
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">📱 WhatsApp</div>
          <div className="floating-card card-2">📧 Email</div>
          <div className="floating-card card-3">🌐 Internet</div>
        </div>
      </section>

      {/* CURSOS DESTACADOS */}
      <section className="featured-courses stats-section">
        <div className="section-header">
          <h2>Cursos Populares</h2>
          <p className="section-subtitle">
            Comienza con estos cursos recomendados para principiantes
          </p>
        </div>

        <div className="course-grid">
          <div className="course-card">
            <div className="course-icon">📱</div>
            <h3>WhatsApp Básico</h3>
            <p>Aprende a enviar mensajes, fotos y audios fácilmente con tu familia.</p>
            <Link to="/courses" className="course-link">Ver más →</Link>
          </div>

          <div className="course-card">
            <div className="course-icon">🌐</div>
            <h3>Internet Seguro</h3>
            <p>Cómo buscar información segura y evitar estafas en línea.</p>
            <Link to="/courses" className="course-link">Ver más →</Link>
          </div>

          <div className="course-card">
            <div className="course-icon">📧</div>
            <h3>Correo Electrónico</h3>
            <p>Crea tu correo y aprende a enviar mensajes importantes.</p>
            <Link to="/courses" className="course-link">Ver más →</Link>
          </div>

          <div className="course-card">
            <div className="course-icon">🎥</div>
            <h3>Videollamadas</h3>
            <p>Conecta con tus seres queridos a través de video en vivo.</p>
            <Link to="/courses" className="course-link">Ver más →</Link>
          </div>
        </div>

        <div className="courses-footer">
          <Link to="/courses" className="btn btn-outline">
            Ver todos los cursos
          </Link>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="features-section">
        <h2 className="features-title">¿Por qué elegir nuestra plataforma?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Fácil de Usar</h3>
            <p>Interfaz diseñada con letras grandes y navegación simple, sin distracciones.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Asistente IA</h3>
            <p>Un asistente inteligente que responde tus preguntas paso a paso, disponible 24/7.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Sigue tu Progreso</h3>
            <p>Regístrate para guardar tu avance y retomar donde lo dejaste.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Lecciones Claras</h3>
            <p>Cada paso está explicado con imágenes y videos para mejor comprensión.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguro y Privado</h3>
            <p>Tus datos están protegidos y nunca los compartimos con terceros.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Para Toda la Familia</h3>
            <p>Aprende a tu propio ritmo, sin presión, sin límite de tiempo.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta cta-section">
        <h2>¿Listo para comenzar?</h2>
        <p>Únete a miles de adultos mayores que ya están aprendiendo tecnología</p>
        <Link to="/courses" className="btn btn-primary btn-lg btn-cta">
          Comenzar Ahora
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer footer-section">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Alfabetización Digital</h4>
            <p>Plataforma educativa para adultos mayores</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <Link to="/courses">Cursos</Link>
            <Link to="/chatbot">Asistente IA</Link>
            <Link to="/admin">Admin</Link>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>Universidad Continental</p>
            <p>info@alfabetizacion.edu</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Alfabetización Digital - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
