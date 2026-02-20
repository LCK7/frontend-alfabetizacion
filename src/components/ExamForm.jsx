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

    onSubmit({
      ...form,
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