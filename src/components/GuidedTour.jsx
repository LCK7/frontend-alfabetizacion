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
    description: "Usa esta barra para navegar entre diferentes secciones.",
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

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStartTour = () => {
    setShowModal(false);
    setIsActive(true);
    setCurrentStep(0);
    localStorage.setItem("tourSeen", "true");
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

  useEffect(() => {
    if (isActive) {
      const step = TOUR_STEPS[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        setTimeout(() => {
          if (step.target === "nav") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const rect = targetElement.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            window.scrollTo({
              top: elementTop - (window.innerHeight * 0.15),
              behavior: 'smooth'
            });
          }
        }, 150);
      }
    }
  }, [isActive, currentStep]);

  if (!showModal && !isActive) return null;

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
              <button className="tour-option-btn tour-option-guide" onClick={handleStartTour}>
                <div className="option-icon">👨‍🏫</div>
                <div className="option-content">
                  <h3>Realizar Guía Interactiva</h3>
                  <p>Aprende paso a paso con instrucciones sobre cada sección de la página</p>
                </div>
                <div className="option-arrow">→</div>
              </button>
              <button className="tour-option-btn tour-option-explore" onClick={handleSkipTour}>
                <div className="option-icon">🗺️</div>
                <div className="option-content">
                  <h3>Explorar por Tu Cuenta</h3>
                  <p>Descubre la plataforma libremente. Puedes volver al tour cuando quieras</p>
                </div>
                <div className="option-arrow">→</div>
              </button>
            </div>
            <p className="tour-skip-note" onClick={handleSkipTour}>Saltar por ahora</p>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    const step = TOUR_STEPS[currentStep];
    const targetElement = document.querySelector(step.target);
    const rect = targetElement ? targetElement.getBoundingClientRect() : null;
    const isNav = step.target === "nav";

    const getTooltipStyle = () => {
      if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      
      const tooltipWidth = Math.min(420, window.innerWidth - 60);
      let top, left;

      if (isNav) {
        top = rect.bottom + 20; 
        left = (window.innerWidth / 2) - (tooltipWidth / 2);
      } else {
        top = rect.top + window.scrollY + 40;
        left = (rect.left + window.scrollX + rect.width / 2) - (tooltipWidth / 2);
      }

      left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));

      return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        position: isNav ? "fixed" : "absolute",
        zIndex: 100000
      };
    };

    return (
      <>
        {rect && (
          <div
            className="tour-highlight"
            style={{
              top: isNav ? rect.top : rect.top + window.scrollY - 4,
              left: isNav ? rect.left : rect.left + window.scrollX - 4,
              width: isNav ? rect.width : rect.width + 8,
              height: isNav ? rect.height : rect.height + 8,
              position: isNav ? "fixed" : "absolute",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
              pointerEvents: "none",
              zIndex: 99999,
              borderRadius: isNav ? "0" : "8px"
            }}
          />
        )}

        <div className="tour-tooltip" style={getTooltipStyle()}>
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
            <span className="progress-text">Paso {currentStep + 1} de {TOUR_STEPS.length}</span>
          </div>
          <div className="tour-actions">
            <button className="tour-btn tour-btn-prev" onClick={handlePrevStep} disabled={currentStep === 0}>
              Anterior
            </button>
            <button className="tour-btn tour-btn-next" onClick={handleNextStep}>
              {currentStep === TOUR_STEPS.length - 1 ? "Finalizar ✓" : "Siguiente"}
            </button>
          </div>
          <button className="tour-btn-skip" onClick={handleEndTour}>Saltar tour</button>
        </div>
      </>
    );
  }

  return null;
}