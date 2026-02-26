import { useState, useEffect } from "react";
import api from "../../api/api";
import "./LessonForm.css";
import LessonEditorNotion from "../../components/LessonEditorNotion";

export default function LessonForm({ onSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [video_url, setVideoUrl] = useState(initialData?.video_url || "");
  const [order, setOrder] = useState(initialData?.order?.toString() || "1");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sincronizar contenido cuando cambia initialData (edición)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setVideoUrl(initialData.video_url || "");
      setOrder(initialData.order?.toString() || "1");
      console.log('Lección para editar cargada:', initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || saving) return;

    setSaving(true);
    let uploadedUrls = [];

    try {
      // Subir archivos si existen
      if (files.length > 0) {
        setUploading(true);
        const form = new FormData();
        files.forEach((f) => form.append("files", f));
        const token = localStorage.getItem("token");

        try {
          const res = await api.post("/uploads", form, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          uploadedUrls = res.data.files ? res.data.files.map((f) => f.url) : [];
          console.log('✅ Archivos subidos:', uploadedUrls);
        } catch (uploadError) {
          console.error('❌ Error al subir archivos:', uploadError);
          console.error('Response:', uploadError.response?.data);
          uploadedUrls = [];
        } finally {
          setUploading(false);
        }
      }

      // Guardar lección
      console.log('📝 Guardando lección:', { title, content, video_url, order });
      
      await onSubmit({
        title: title.trim(),
        content,
        video_url: video_url.trim(),
        order: Number(order),
        resources: uploadedUrls,
      });

      console.log('✅ Lección guardada exitosamente');
      setFiles([]);
      
    } catch (error) {
      console.error('❌ Error al guardar lección:', error);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data?.message || error.message);
      
      const errorMsg = error.response?.data?.message || error.message || 'Error desconocido al guardar';
      alert(`Error al guardar la lección:\n${errorMsg}`);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lesson-form">
      <div className="lesson-form-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la lección"
          required
        />
      </div>

      <div className="lesson-form-group">
        <input
          value={video_url}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="URL del video (opcional)"
        />
      </div>

      <div className="lesson-form-group">
        <input
          type="number"
          min="1"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>

      <div className="lesson-form-editor">
        <LessonEditorNotion
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="lesson-form-group">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>

      {files.length > 0 && (
        <div className="lesson-files-preview">
          {files.map((file, i) => (
            <div key={i} className="lesson-file-item">
              {file.name}
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || saving || !title.trim()}
        className="lesson-save-btn"
      >
        {uploading ? "Subiendo archivos..." : saving ? "Guardando..." : "Guardar lección"}
      </button>
    </form>
  );
}
