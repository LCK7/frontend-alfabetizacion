import { useState } from "react";
import "./LessonExam.css";

export default function LessonExam({ exams = [] }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentExamIdx, setCurrentExamIdx] = useState(0);
  const [progress, setProgress] = useState({ correct: 0, total: 0 });

  if (!exams.length) {
    return (
      <div className="exam-empty">
        <p className="exam-empty-message">
          No hay exámenes disponibles.
        </p>
      </div>
    );
  }

  const currentExam = exams[currentExamIdx];

  const handleAnswer = (examId, optionId) => {
    if (!submitted) {
      setAnswers(prev => ({
        ...prev,
        [examId]: optionId
      }));
    }
  };

  const submitExam = () => {
    setLoading(true);
    
    try {
      let correct = 0;
      const newFeedback = {};

      // Autoevaluación local - comparar respuestas con correctAnswer
      for (const exam of exams) {
        const selectedAnswer = answers[exam.id];
        const isCorrect = selectedAnswer === exam.correctAnswer;
        
        if (isCorrect) correct++;

        newFeedback[exam.id] = {
          isCorrect,
          selectedAnswer,
          correctAnswer: exam.correctAnswer
        };
      }

      const finalScore = Math.round((correct / exams.length) * 100);

      setScore(finalScore);
      setFeedback(newFeedback);
      setProgress({ correct, total: exams.length });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentExamIdx > 0) {
      setCurrentExamIdx(currentExamIdx - 1);
    }
  };

  const handleNext = () => {
    if (currentExamIdx < exams.length - 1) {
      setCurrentExamIdx(currentExamIdx + 1);
    }
  };

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2 className="exam-title">Evaluación</h2>

        <div className="exam-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentExamIdx + 1) / exams.length) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            Pregunta {currentExamIdx + 1} de {exams.length}
          </p>
        </div>
      </div>

      <div className="exam-card">
        <h3 className="question">{currentExam.question}</h3>

        <div className="options-container">
          {currentExam.options?.map((option, idx) => {
            const isSelected = answers[currentExam.id] === option.id;
            const isCorrect =
              feedback[currentExam.id]?.isCorrect && isSelected;
            const isWrong =
              feedback[currentExam.id] &&
              !feedback[currentExam.id]?.isCorrect &&
              isSelected;

            return (
              <label
                key={option.id}
                className={`option-label
                  ${submitted && isCorrect ? "correct" : ""}
                  ${submitted && isWrong ? "wrong" : ""}
                  ${isSelected && !submitted ? "selected" : ""}
                `}
              >
                <input
                  type="radio"
                  name={`exam-${currentExam.id}`}
                  disabled={submitted}
                  checked={isSelected}
                  onChange={() =>
                    handleAnswer(currentExam.id, option.id)
                  }
                  className="option-radio"
                />
                <span className="option-text">
                  {String.fromCharCode(65 + idx)}. {option.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="exam-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentExamIdx === 0 || !submitted}
          className="nav-button"
        >
          ← Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={currentExamIdx === exams.length - 1 || !submitted}
          className="nav-button"
        >
          Siguiente →
        </button>
      </div>

      {!submitted && (
        <div className="exam-footer">
          <button
            className="btn-submit btn-large"
            onClick={submitExam}
            disabled={
              Object.keys(answers).length < exams.length || loading
            }
          >
            {loading ? "Procesando..." : "Enviar Examen"}
          </button>
        </div>
      )}

      {submitted && score !== null && (
        <div className="exam-result">
          <div className="progress-summary">
            <p className="progress-text">
              {progress.correct} de {progress.total} respuestas correctas
            </p>
          </div>
          <div
            className={`score-display ${
              score >= 70 ? "pass" : "fail"
            }`}
          >
            <div className="score-value">{score}%</div>
            <div className="score-label">
              {score >= 70 ? "¡Aprobado!" : "Necesitas repasar"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}