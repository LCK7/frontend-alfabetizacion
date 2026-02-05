import { useState, useEffect } from "react";
import api from "../../api/api";
import "./LessonForm.css";

export default function LessonForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [video_url, setVideoUrl] = useState("");
  const [order, setOrder] = useState("1");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [Editor, setEditor] = useState(null);
  const [loadingEditor, setLoadingEditor] = useState(false);

  // intentamos carga dinámica del editor si está disponible
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingEditor(true);
        // evitar que Vite haga análisis estático de dependencias
        const moduleName = "react-" + "quill";
        const mod = await import(moduleName);
        // sólo asignar si sigue montado
        if (mounted && mod && mod.default) setEditor(() => mod.default);
      } catch (err) {
        // no hacer nada: fallback a textarea
        console.warn("react-quill no disponible, usando textarea como fallback.", err);
      } finally {
        setLoadingEditor(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("El título de la lección es requerido");
      return;
    }

    let uploadedUrls = [];

    try {
      if (files.length > 0) {
        setUploading(true);
        const form = new FormData();
        for (const f of files) form.append("files", f);
        const token = localStorage.getItem("token");
        const res = await api.post("/uploads", form, {
          headers: { Authorization: token, "Content-Type": "multipart/form-data" },
        });
        uploadedUrls = res.data.files.map((f) => f.url);
      }
    } catch (err) {
      console.error("Error subiendo archivos:", err);
      alert("Error subiendo las imágenes");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    onSubmit({
      title: title.trim(),
      content: content,
      video_url: video_url.trim(),
      order: parseInt(order) || 1,
      attachments: uploadedUrls,
    });

    setTitle("");
    setContent("");
    setVideoUrl("");
    setOrder("1");
    setFiles([]);
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
        <label htmlFor="content">Contenido (editor)</label>
        {Editor ? (
          // Editor cargado dinámicamente
          <Editor value={content} onChange={setContent} theme="snow" />
        ) : (
          <>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe los pasos detallados para esta lección..." rows="6" />
            {loadingEditor && <p>Cargando editor enriquecido...</p>}
            {!loadingEditor && (
              <p className="editor-note">Editor enriquecido no disponible, se usa textarea. Para habilitarlo instala `react-quill` y `quill`.</p>
            )}
          </>
        )}
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
        <label>Capturas / Imágenes (opcional)</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
        {files.length > 0 && <p>{files.length} archivo(s) listo(s) para subir</p>}
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

      <button type="submit" className="btn-submit" disabled={uploading}>
        {uploading ? "Subiendo..." : "✅ Crear Lección"}
      </button>
    </form>
  );
}
