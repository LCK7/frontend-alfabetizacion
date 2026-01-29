import { useState } from "react";
import "./LessonForm.css";

export default function LessonForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [video_url, setVideoUrl] = useState("");
  const [order, setOrder] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("El título de la lección es requerido");
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      video_url: video_url.trim(),
      order: parseInt(order) || 1,
    });

    setTitle("");
    setContent("");
    setVideoUrl("");
    setOrder("1");
  };

  return (
    <form className="lesson-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Título de la Lección *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Paso 1 - Encender la computadora"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Contenido</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe los pasos detallados para esta lección..."
          rows="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="video_url">URL del Video (opcional)</label>
        <input
          id="video_url"
          type="url"
          value={video_url}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="order">Orden</label>
        <input
          id="order"
          type="number"
          min="1"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="1"
        />
      </div>

      <button type="submit" className="btn-submit">
        ✅ Crear Lección
      </button>
    </form>
  );
}
