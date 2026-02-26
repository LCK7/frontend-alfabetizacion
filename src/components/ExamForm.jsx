import { useState } from "react";

export default function ExamForm({ onSubmit, selectedCourse, lessons }) {
  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    correct_option: "a",
    lessonId: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generar opciones con IDs únicos y mapear respuesta correcta
    const options = [
      { id: "opt-a", text: form.option_a },
      { id: "opt-b", text: form.option_b },
      { id: "opt-c", text: form.option_c }
    ].filter(opt => opt.text.trim()); // Filtrar opciones vacías

    // Mapear respuesta correcta ("a", "b", "c") al ID real de la opción
    const correctAnswerMap = {
      "a": "opt-a",
      "b": "opt-b", 
      "c": "opt-c"
    };

    onSubmit({
      question: form.question,
      options,
      correctAnswer: correctAnswerMap[form.correct_option],
      courseId: selectedCourse.id,
      lessonId: form.lessonId || null
    });

    setForm({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      correct_option: "a",
      lessonId: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="question"
        value={form.question}
        onChange={handleChange}
        placeholder="Pregunta"
        required
      />

      <input
        name="option_a"
        value={form.option_a}
        onChange={handleChange}
        placeholder="Opción A"
      />

      <input
        name="option_b"
        value={form.option_b}
        onChange={handleChange}
        placeholder="Opción B"
      />

      <input
        name="option_c"
        value={form.option_c}
        onChange={handleChange}
        placeholder="Opción C"
      />

      <select
        name="correct_option"
        value={form.correct_option}
        onChange={handleChange}
      >
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>

      <select
        name="lessonId"
        value={form.lessonId}
        onChange={handleChange}
      >
        <option value="">Sin lección</option>
        {lessons.map(l => (
          <option key={l.id} value={l.id}>
            {l.title}
          </option>
        ))}
      </select>

      <button type="submit">Crear examen</button>
    </form>
  );
}