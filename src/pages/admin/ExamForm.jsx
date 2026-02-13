import { useEffect, useState } from "react";
import api from "../../api/api";
import "./ExamForm.css";

export default function ExamForm({ onSubmit, selectedCourse }) {
  const [courseId, setCourseId] = useState(selectedCourse?.id || "");
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [correct, setCorrect] = useState("a");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse) setCourseId(selectedCourse.id);
  }, [selectedCourse]);

  useEffect(() => {
    if (!courseId) return setLessons([]);
    api.get(`/courses/${courseId}`).then(r => setLessons(r.data.lessons || [])).catch(() => setLessons([]));
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !courseId) return alert("Pregunta y curso son requeridos");

    setLoading(true);
    try {
      await onSubmit({
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        correct_option: correct,
        courseId,
        lessonId: lessonId || undefined
      });
      setQuestion(""); setOptionA(""); setOptionB(""); setOptionC(""); setCorrect("a"); setLessonId("");
    } catch (err) {
      console.error(err);
      alert("Error creando examen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-form container">
      <h2>Crear Examen</h2>
      <form onSubmit={handleSubmit} className="exam-form-card">
        <div className="form-group">
          <label>Curso</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">-- Seleccionar curso --</option>
            {selectedCourse && <option value={selectedCourse.id}>{selectedCourse.title}</option>}
          </select>
        </div>

        <div className="form-group">
          <label>Lección (opcional)</label>
          <select value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
            <option value="">-- Ninguna --</option>
            {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Pregunta</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Opción A</label>
          <input value={optionA} onChange={(e) => setOptionA(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Opción B</label>
          <input value={optionB} onChange={(e) => setOptionB(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Opción C</label>
          <input value={optionC} onChange={(e) => setOptionC(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Opción correcta</label>
          <select value={correct} onChange={(e) => setCorrect(e.target.value)}>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Examen'}
        </button>
      </form>
    </div>
  );
}
