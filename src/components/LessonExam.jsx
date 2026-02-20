import { useState } from "react";
import { saveExamResult } from "../api/examResults";
import "./LessonExam.css";

export default function LessonExam({ exams }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!exams || exams.length === 0) {
    return <p>No hay exámenes para esta lección</p>;
  }

  const handleAnswer = (examId, option) => {
    setAnswers(prev => ({ ...prev, [examId]: option }));
  };

  const submitExam = async () => {
    let correct = 0;

    exams.forEach(ex => {
      if (answers[ex.id] === ex.correct_option) correct++;
    });

    const finalScore = Math.round((correct / exams.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    const token = localStorage.getItem("token");

    if (token) {
      try {
        for (const ex of exams) {
          const isCorrect = answers[ex.id] === ex.correct_option;

          await saveExamResult({
            examId: ex.id,
            score: isCorrect ? 100 : 0
          });
        }
      } catch (err) {
        console.error("Error guardando resultados", err);
      }
    }
  };

  return (
    <div className="exam-container">

      {exams.map(ex => (
        <div key={ex.id} className="exam-card">

          <p className="question">{ex.question}</p>

          <label>
            <input
              type="radio"
              name={`exam-${ex.id}`}
              disabled={submitted}
              onChange={() => handleAnswer(ex.id, "A")}
            />
            {ex.option_a}
          </label>

          <label>
            <input
              type="radio"
              name={`exam-${ex.id}`}
              disabled={submitted}
              onChange={() => handleAnswer(ex.id, "B")}
            />
            {ex.option_b}
          </label>

          <label>
            <input
              type="radio"
              name={`exam-${ex.id}`}
              disabled={submitted}
              onChange={() => handleAnswer(ex.id, "C")}
            />
            {ex.option_c}
          </label>

        </div>
      ))}

      {!submitted && (
        <button className="btn-primary" onClick={submitExam}>
          Enviar examen
        </button>
      )}

      {score !== null && (
        <h3 className="score">Tu nota: {score}%</h3>
      )}

    </div>
  );
}