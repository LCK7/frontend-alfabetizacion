import { useState, useEffect } from "react";
import api from "../../api/api";
import "./CourseForm.css";

export default function CourseForm({ onSubmit, initialData }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Básico");
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(initialData?.cover || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLevel(initialData.level || "Básico");
      setCoverUrl(initialData.cover || "");
    } else {
      setTitle("");
      setDescription("");
      setLevel("Básico");
      setCoverUrl("");
    }
  }, [initialData]);

  const handleNext = () => setStep((s) => Math.min(2, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleUploadCover = async () => {
    if (!coverFile) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("files", coverFile);
      const token = localStorage.getItem("token");
      const res = await api.post("/uploads", form, { headers: { Authorization: token } });
      if (res.data.files && res.data.files[0]) setCoverUrl(res.data.files[0].url);
    } catch (err) {
      console.error("Error subiendo cover:", err);
      alert("No se pudo subir la imagen de portada");
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("El título es requerido");
    onSubmit({ title: title.trim(), description: description.trim(), level, cover: coverUrl });
    // reset
    setStep(1);
    setTitle("");
    setDescription("");
    setLevel("Básico");
    setCoverFile(null);
    setCoverUrl("");
  };

  return (
    <div className="course-form-wizard">
      <div className="wizard-steps">
        <div className={`wizard-step ${step === 1 ? "active" : ""}`}>1. Información</div>
        <div className={`wizard-step ${step === 2 ? "active" : ""}`}>2. Portada</div>
      </div>

      {step === 1 && (
        <form className="course-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          <div className="form-group">
            <label htmlFor="title">Título del Curso *</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Introducción al Email" required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe el contenido del curso..." rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="level">Nivel</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="wizard-actions">
            <button className="btn-secondary" onClick={handleBack} type="button">Volver</button>
            <button className="btn-primary" type="submit">Siguiente →</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="course-form" onSubmit={handleFinish}>
          <div className="form-group">
            <label>Imagen de Portada (opcional)</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            <button type="button" className="btn-secondary" onClick={handleUploadCover} disabled={!coverFile || uploading}>{uploading ? "Subiendo..." : "Subir imagen"}</button>
          </div>

          {coverUrl && (
            <div className="form-group">
              <label>Preview:</label>
              <img src={coverUrl} alt="cover" style={{ maxWidth: "100%" }} />
            </div>
          )}

          <div className="wizard-actions">
            <button type="button" className="btn-secondary" onClick={handleBack}>← Atrás</button>
            <button type="submit" className="btn-primary">{initialData ? "Actualizar Curso" : "Crear Curso"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
