import { useState, useEffect } from "react";
import "./CourseForm.css";

export default function CourseForm({ onSubmit, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Básico");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLevel(initialData.level || "Básico");
    } else {
      setTitle("");
      setDescription("");
      setLevel("Básico");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("El título del curso es requerido");
      return;
    }

    onSubmit({ 
      title: title.trim(), 
      description: description.trim(), 
      level 
    });

    setTitle("");
    setDescription("");
    setLevel("Básico");
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Título del Curso *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Introducción al Email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el contenido del curso..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="level">Nivel</label>
        <select 
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <button type="submit" className="btn-submit">
        {initialData ? "✅ Actualizar Curso" : "✅ Crear Curso"}
      </button>
    </form>
  );
}
