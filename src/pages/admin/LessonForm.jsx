import { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || saving) return;

    setSaving(true);
    let uploadedUrls = [];

    try {
      if (files.length > 0) {
        setUploading(true);

        const form = new FormData();
        files.forEach((f) => form.append("files", f));

        const token = localStorage.getItem("token");

        const res = await api.post("/uploads", form, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedUrls = res.data.files.map((f) => f.url);
      }

      await onSubmit({
        title,
        content,
        video_url,
        order: Number(order),
        resources: uploadedUrls,
      });

      setFiles([]);
    } finally {
      setUploading(false);
      setSaving(false);
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
