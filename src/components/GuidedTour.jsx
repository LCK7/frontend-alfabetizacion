import { useState, useEffect } from "react";
import "./GuidedTour.css";

const TOUR_STEPS = [
  {
    target: ".hero-section",
    title: "👋 Bienvenido a Alfabetización Digital",
    description: "Aquí comienza tu viaje de aprendizaje. Somos una plataforma dedicada a la educación digital para adultos mayores.",
  },
  {
    target: ".featured-courses",
    title: "📚 Cursos Populares",
    description: "Explora nuestros cursos recomendados. Cada uno está diseñado paso a paso para que aprendas fácilmente.",
  },
  {
    target: ".features-section",
    title: "✨ Nuestras Características",
    description: "Ofrecemos educación segura, sin presiones, en tu propio tiempo. Descubre por qué somos la mejor opción.",
  },
  {
    target: ".cta-section",
    title: "🚀 Comienza Ahora",
    description: "Este botón te lleva a nuestra página de cursos donde puedes elegir qué aprender.",
  },
  {
    target: "nav",
    title: "🧭 Navegación Principal",
    description: "Usa esta barra para navegar entre diferentes secciones. Si eres administrador, verás 'Panel Admin' aquí.",
  },
  {
    target: ".footer",
    title: "ℹ️ Información Adicional",
    description: "Aquí encontrarás más información y contacto. ¡Estamos para ayudarte!",
  },
];

export default function GuidedTour() {
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Mostrar modal cada vez que entra a la página
  useEffect(() => {
    setTimeout(() => setShowModal(true), 300);
  }, []);

  const handleStartTour = () => {
    setShowModal(false);
    setIsActive(true);
    setCurrentStep(0);
    localStorage.setItem("tourSeen", "true");
  };

  const handleViewGuide = () => {
    setShowModal(false);
    // Mostrar información sin activar tour interactivo
  };

  const handleNextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleEndTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEndTour = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const handleSkipTour = () => {
    setShowModal(false);
  };

  // Scroll automático al elemento cuando cambia el paso
  useEffect(() => {
    if (isActive) {
      const step = TOUR_STEPS[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        // Esperar un poco para que se renderice
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = rect.height;
          const windowHeight = window.innerHeight;
          
          // Calcula el scroll para que el elemento esté centrado
          const scrollTop = elementTop - (windowHeight / 2) + (elementHeight / 2);
          
          window.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }, 150);
      }
    }
  }, [isActive, currentStep]);

  if (!showModal && !isActive) return null;

  // MODAL INICIAL
  if (showModal) {
    return (
      <div className="tour-modal-overlay" onClick={handleSkipTour}>
        <div className="tour-modal" onClick={(e) => e.stopPropagation()}>
          <button className="tour-close" onClick={handleSkipTour}>✕</button>
          
          <div className="tour-modal-content">
            <div className="tour-modal-header">
              <h2>🎓 Bienvenido a Alfabetización Digital</h2>
              <p>¿Cómo deseas explorar la plataforma?</p>
            </div>

            <div className="tour-options">
              <button 
                className="tour-option-btn tour-option-guide"
                onClick={handleStartTour}
              >
                <div className="option-icon">👨‍🏫</div>
                <div className="option-content">
                  <h3>Realizar Guía Interactiva</h3>
                  <p>Aprende paso a paso con instrucciones sobre cada sección de la página</p>
                </div>
                <div className="option-arrow">→</div>
              </button>

              <button 
                className="tour-option-btn tour-option-explore"
                onClick={handleViewGuide}
              >
                <div className="option-icon">🗺️</div>
                <div className="option-content">
                  <h3>Explorar por Tu Cuenta</h3>
                  <p>Descubre la plataforma libremente. Puedes volver al tour cuando quieras</p>
                </div>
                <div className="option-arrow">→</div>
              </button>
            </div>

            <div className="tour-info-box">
              <h4>📍 ¿Qué encontrarás en esta página?</h4>
              <ul className="tour-features-list">
                <li><strong>Home:</strong> Introducción y características de la plataforma</li>
                <li><strong>Cursos:</strong> Explora todos los cursos disponibles</li>
                <li><strong>Navega:</strong> Usa la barra superior para ir a diferentes secciones</li>
                <li><strong>Login/Registro:</strong> Crea tu cuenta para guardar progreso</li>
                <li><strong>Panel Admin:</strong> (Solo para administradores) Crea cursos y lecciones</li>
              </ul>
            </div>

            <p className="tour-skip-note" onClick={handleSkipTour}>
              Puedes saltarte esto en cualquier momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  // TOUR INTERACTIVO
  if (isActive) {
    const step = TOUR_STEPS[currentStep];
    const targetElement = document.querySelector(step.target);

    return (
      <>
        {/* Overlay oscuro con z-index bajo */}
        <div className="tour-overlay" style={{ zIndex: 9980 }} />

        {/* Highlight del elemento */}
        {targetElement && (
          <div
            className="tour-highlight"
            style={{
              top: targetElement.getBoundingClientRect().top + window.scrollY - 8,
              left: targetElement.getBoundingClientRect().left + window.scrollX - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
              zIndex: 9985,
            }}
          />
        )}

        {/* Caja de información - SIEMPRE AL FRENTE */}
        {(() => {
          const tooltipWidth = 450;
          const tooltipHeight = 250;
          const padding = 20;
          const gap = 20;
          
          let top, left;
          
          if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            const spaceBelow = window.innerHeight - targetRect.bottom;
            const spaceAbove = targetRect.top;
            
            if (spaceBelow > tooltipHeight + gap) {
              top = window.scrollY + targetRect.bottom + gap;
            } else if (spaceAbove > tooltipHeight + gap) {
              top = window.scrollY + targetRect.top - tooltipHeight - gap;
            } else {
              top = window.scrollY + Math.max(gap, (window.innerHeight - tooltipHeight) / 2);
            }
          } else {
            // Fallback: center en la pantalla si no encuentra elemento
            top = window.scrollY + (window.innerHeight - tooltipHeight) / 2;
          }
          
          // Posición horizontal centrada
          left = Math.max(padding, (window.innerWidth - tooltipWidth) / 2);
          
          return (
            <div
              className={`tour-tooltip`}
              style={{
                position: "fixed",
                top: Math.max(padding, top) + "px",
                left: left + "px",
                width: tooltipWidth + "px",
                zIndex: 99999,
              }}
            >
              <div className="tour-tooltip-header">
                <h3>{step.title}</h3>
                <button className="tour-tooltip-close" onClick={handleEndTour}>✕</button>
              </div>

              <p className="tour-tooltip-description">{step.description}</p>

              <div className="tour-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  Paso {currentStep + 1} de {TOUR_STEPS.length}
                </span>
              </div>

              <div className="tour-actions">
                <button
                  className="tour-btn tour-btn-prev"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  ← Anterior
                </button>

                <div className="tour-dots">
                  {TOUR_STEPS.map((_, index) => (
                    <button
                      key={index}
                      className={`tour-dot ${index === currentStep ? "active" : ""}`}
                      onClick={() => setCurrentStep(index)}
                      title={`Ir al paso ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  className="tour-btn tour-btn-next"
                  onClick={handleNextStep}
                >
                  {currentStep === TOUR_STEPS.length - 1 ? "Finalizar ✓" : "Siguiente →"}
                </button>
              </div>

              <button className="tour-btn-skip" onClick={handleEndTour}>
                Saltar tour
              </button>
            </div>
          );
        })()}
      </>
    );
  }

  return null;
}
