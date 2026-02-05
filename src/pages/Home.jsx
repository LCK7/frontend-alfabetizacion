import { Link } from "react-router-dom";
import GuidedTour from "../components/GuidedTour";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <GuidedTour />

      <section className="hero hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Aprende Tecnología
            <br />
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

        <div className="hero-image-container">
          <div className="hero-blob"></div>
          
          {/* Tarjetas Principales */}
          <div className="floating-card card-1"><span>📱</span> WhatsApp</div>
          <div className="floating-card card-2"><span>📧</span> Email</div>
          <div className="floating-card card-3"><span>🌐</span> Internet</div>
          
          {/* Nuevos Contenidos Añadidos */}
          <div className="floating-card card-4"><span>🎥</span> Zoom</div>
          <div className="floating-card card-5"><span>🎬</span> YouTube</div>
          <div className="floating-card card-6"><span>📸</span> Fotos</div>
          <div className="floating-card card-7"><span>🏦</span> Banca Móvil</div>
          <div className="floating-card card-8"><span>🛡️</span> Seguridad</div>
          <div className="floating-card card-9"><span>💬</span> Facebook</div>

        </div>
      </section>

      <section className="featured-courses">
        <div className="section-header">
          <span className="section-tag">Empieza hoy</span>
          <h2>Cursos Populares</h2>
          <p className="section-subtitle">
            Seleccionados especialmente para que aprendas desde cero, sin miedo y con calma.
          </p>
        </div>

        <div className="course-grid">
          <div className="course-card">
            <div className="course-badge basic">Principiante</div>
            <div className="course-icon">📱</div>
            <h3>WhatsApp Básico</h3>
            <p>Aprende a enviar mensajes, fotos y audios fácilmente con tu familia.</p>
            <div className="course-meta"><span>⏱️ 4 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>

          <div className="course-card">
            <div className="course-badge secure">Seguridad</div>
            <div className="course-icon">🌐</div>
            <h3>Internet Seguro</h3>
            <p>Cómo buscar información confiable y evitar estafas o virus en línea.</p>
            <div className="course-meta"><span>⏱️ 5 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>

          <div className="course-card">
            <div className="course-badge basic">Principiante</div>
            <div className="course-icon">📧</div>
            <h3>Correo Electrónico</h3>
            <p>Crea tu cuenta de Gmail y aprende a leer y escribir correos importantes.</p>
            <div className="course-meta"><span>⏱️ 6 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>

          <div className="course-card">
            <div className="course-badge video">Video</div>
            <div className="course-icon">🎥</div>
            <h3>Videollamadas</h3>
            <p>Conecta por Zoom o Google Meet con tus seres queridos en tiempo real.</p>
            <div className="course-meta"><span>⏱️ 3 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>

          <div className="course-card">
            <div className="course-badge social">Social</div>
            <div className="course-icon">👥</div>
            <h3>Facebook para Abuelos</h3>
            <p>Encuentra a viejos amigos y comparte tus mejores recuerdos de forma segura.</p>
            <div className="course-meta"><span>⏱️ 5 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>

          <div className="course-card">
            <div className="course-badge mobile">Celular</div>
            <div className="course-icon">⚙️</div>
            <h3>Ajustes del Celular</h3>
            <p>Pon la letra más grande, cambia el tono de llamada y limpia tu memoria.</p>
            <div className="course-meta"><span>⏱️ 4 lecciones</span></div>
            <Link to="/courses" className="course-link">Empezar Curso →</Link>
          </div>
        </div>

        <div className="courses-footer">
          <Link to="/courses" className="btn-view-all">
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">Nuestros Valores</span>
            <h2 className="features-title">¿Por qué aprender con nosotros?</h2>
            <p className="section-subtitle">Diseñamos cada detalle pensando en tu comodidad y seguridad</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <span className="feature-icon">🔍</span>
              </div>
              <h3>Letras Grandes</h3>
              <p>Todo el contenido es fácil de leer, con botones amplios y colores descansados para la vista.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-green">
                <span className="feature-icon">🐢</span>
              </div>
              <h3>A tu Propio Ritmo</h3>
              <p>Sin presiones ni horarios. Puedes repetir las lecciones todas las veces que necesites.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-purple">
                <span className="feature-icon">🤖</span>
              </div>
              <h3>Ayuda con IA</h3>
              <p>Nuestro asistente inteligente te guía paso a paso si te sientes perdido en cualquier momento.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-orange">
                <span className="feature-icon">🔒</span>
              </div>
              <h3>Ambiente Seguro</h3>
              <p>Aprende a identificar estafas y navega por internet sin miedo a errores o engaños.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-red">
                <span className="feature-icon">💬</span>
              </div>
              <h3>Lenguaje Sencillo</h3>
              <p>Explicamos la tecnología sin usar palabras complicadas o tecnicismos en inglés.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-teal">
                <span className="feature-icon">👨‍👩‍👧‍👦</span>
              </div>
              <h3>Conecta con la Familia</h3>
              <p>El objetivo final es que puedas compartir fotos y videollamadas con tus seres queridos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta cta-section">
        <h2>¿Listo para comenzar?</h2>
        <p>Únete a miles de adultos mayores que ya están aprendiendo tecnología</p>
        <Link to="/courses" className="btn btn-primary btn-lg btn-cta">
          Comenzar Ahora
        </Link>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">Alfabetización<span>Digital</span></h3>
            <p>Empoderando a nuestros adultos mayores a través de la tecnología, con paciencia y cariño.</p>
            <div className="footer-socials">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">t</a>
              <a href="#" className="social-icon">ig</a>
              <a href="#" className="social-icon">yt</a>
            </div>
          </div>

          <div className="footer-links-container">
            <div className="footer-nav">
              <h4>Explorar</h4>
              <Link to="/courses">Todos los Cursos</Link>
              <Link to="/chatbot">Asistente IA</Link>
              <Link to="/about">Sobre Nosotros</Link>
              <Link to="/contact">Ayuda Directa</Link>
            </div>

            <div className="footer-nav">
              <h4>Soporte</h4>
              <Link to="/faq">Preguntas Frecuentes</Link>
              <Link to="/privacy">Privacidad Segura</Link>
              <Link to="/terms">Términos de Uso</Link>
              <Link to="/admin">Acceso Staff</Link>
            </div>

            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>📍 Universidad Continental, Huancayo</p>
              <p>📞 +51 987 654 321</p>
              <p>✉️ ayuda@alfabetizacion.edu</p>
              <div className="footer-badge">
                🛡️ Sitio Seguro para Adultos Mayores
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Alfabetización Digital. Creado con ❤️ para nuestros adultos.</p>
            <div className="footer-bottom-links">
              <span>Idioma: Español (PE)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}