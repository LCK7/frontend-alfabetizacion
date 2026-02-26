import { useEffect, useState } from "react";
import * as examApi from "../../api/exams";
import * as courseApi from "../../api/courses";
import "./ExamForm.css";

const DIFFICULTIES = [
  { value: "facil", label: "Fácil" },
  { value: "media", label: "Media" },
  { value: "dificil", label: "Difícil" }
];

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 5;

export default function ExamForm({ 
  onSubmit, 
  selectedCourse, 
  selectedLesson,
  editingExam,
  onSuccess
}) {
  const [courseId, setCourseId] = useState(selectedCourse?.id || "");
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState(selectedLesson?.id || "");
  
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    options: [
      { id: "opt-1", text: "", isCorrect: true },
      { id: "opt-2", text: "", isCorrect: false }
    ],
    correctAnswer: "opt-1",
    difficulty: "media",
    order: 1
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Cargar formulario para edición
  useEffect(() => {
    if (editingExam) {
      setFormData({
        question: editingExam.question || "",
        description: editingExam.description || "",
        options: editingExam.options || formData.options,
        correctAnswer: editingExam.correctAnswer || "opt-1",
        difficulty: editingExam.difficulty || "media",
        order: editingExam.order || 1
      });
      setCourseId(editingExam.courseId || "");
      setLessonId(editingExam.lessonId || "");
    }
  }, [editingExam]);

  // Cargar cursos
  useEffect(() => {
    loadCourses();
  }, []);

  // Cargar lecciones cuando cambia curso
  useEffect(() => {
    if (courseId) {
      loadLessons(courseId);
    } else {
      setLessons([]);
    }
  }, [courseId]);

  const loadCourses = async () => {
    try {
      const data = await courseApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
      setErrors({ global: "No se pudieron cargar los cursos" });
    }
  };

  const loadLessons = async (cId) => {
    try {
      const data = await courseApi.getLessonsByCourse(cId);
      setLessons(data || []);
    } catch (err) {
      console.error("Error al cargar lecciones:", err);
    }
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar pregunta
    if (!formData.question.trim()) {
      newErrors.question = "La pregunta es obligatoria";
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "La pregunta debe tener al menos 10 caracteres";
    }

    // Validar opciones
    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < MIN_OPTIONS) {
      newErrors.options = `Debe haber al menos ${MIN_OPTIONS} opciones con texto`;
    }

    validOptions.forEach((opt, idx) => {
      if (opt.text.trim().length < 2) {
        newErrors[`option_${idx}`] = "La opción debe tener al menos 2 caracteres";
      }
    });

    // Validar respuesta correcta
    const correctExists = formData.options.some(opt => opt.id === formData.correctAnswer && opt.text.trim());
    if (!correctExists) {
      newErrors.correctAnswer = "Debe seleccionar una opción correcta válida";
    }

    // Validar curso
    if (!courseId) {
      newErrors.courseId = "El curso es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (e) => {
    setFormData(prev => ({ ...prev, question: e.target.value }));
    if (touched.question && errors.question) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs.question;
        return newErrs;
      });
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleOptionChange = (idx, text) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[idx] = { ...newOptions[idx], text };
      return { ...prev, options: newOptions };
    });

    if (touched[`option_${idx}`] && errors[`option_${idx}`]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[`option_${idx}`];
        return newErrs;
      });
    }
  };

  const handleCorrectAnswerChange = (optionId) => {
    setFormData(prev => ({ ...prev, correctAnswer: optionId }));
    if (errors.correctAnswer) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs.correctAnswer;
        return newErrs;
      });
    }
  };

  const addOption = () => {
    if (formData.options.length < MAX_OPTIONS) {
      setFormData(prev => ({
        ...prev,
        options: [
          ...prev.options,
          {
            id: `opt-${Date.now()}`,
            text: "",
            isCorrect: false
          }
        ]
      }));
    }
  };

  const removeOption = (idx) => {
    if (formData.options.length > MIN_OPTIONS) {
      setFormData(prev => {
        const newOptions = prev.options.filter((_, i) => i !== idx);
        // Si se elimina la opción correcta, cambiar a la primera válida
        let newCorrectAnswer = prev.correctAnswer;
        if (prev.options[idx].id === prev.correctAnswer) {
          newCorrectAnswer = newOptions[0]?.id || "opt-1";
        }
        return { ...prev, options: newOptions, correctAnswer: newCorrectAnswer };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sincronizar isCorrect en las opciones con correctAnswer
      const syncedOptions = formData.options
        .filter(opt => opt.text.trim())
        .map(opt => ({
          ...opt,
          isCorrect: opt.id === formData.correctAnswer
        }));

      const payload = {
        question: formData.question.trim(),
        description: formData.description.trim(),
        options: syncedOptions,
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
        courseId: Number(courseId),
        lessonId: lessonId ? Number(lessonId) : null,
        order: Number(formData.order)
      };

      console.log('📝 Guardando examen:', payload);
      console.log('📝 Payload detalles:', {
        question: payload.question ? `"${payload.question.substring(0, 50)}..."` : 'vacío',
        description: payload.description || 'vacío',
        options: payload.options ? `array[${payload.options.length}]` : 'null',
        correctAnswer: payload.correctAnswer,
        difficulty: payload.difficulty,
        courseId: payload.courseId,
        lessonId: payload.lessonId,
        order: payload.order
      });

      console.log('📝 Opciones sincronizadas:', syncedOptions.map(opt => ({
        id: opt.id,
        text: opt.text.substring(0, 30),
        isCorrect: opt.isCorrect
      })));

      if (editingExam) {
        console.log('✏️ Editando examen ID:', editingExam.id);
        console.log('✏️ Enviando PUT a /exams/' + editingExam.id);
        console.log('✏️ Payload completo:', JSON.stringify(payload, null, 2));
        const response = await examApi.updateExam(editingExam.id, payload);
        console.log('✏️ Respuesta del servidor:', response);
        console.log('✏️ PUT completado');
      } else {
        console.log('➕ Creando nuevo examen');
        console.log('➕ Enviando POST a /exams');
        console.log('➕ Payload completo:', JSON.stringify(payload, null, 2));
        const response = await examApi.createExam(payload);
        console.log('➕ Respuesta del servidor:', response);
        console.log('➕ POST completado');
      }

      console.log('✅ Examen guardado exitosamente');

      // Limpiar formulario
      setFormData({
        question: "",
        description: "",
        options: [
          { id: "opt-1", text: "", isCorrect: true },
          { id: "opt-2", text: "", isCorrect: false }
        ],
        correctAnswer: "opt-1",
        difficulty: "media",
        order: 1
      });
      setErrors({});
      setTouched({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("❌ Error al guardar examen:", err);
      console.error("Status:", err.response?.status);
      console.error("Message:", err.response?.data?.message || err.message);
      console.error("Full response:", err.response?.data);
      
      const errorMsg = err.response?.data?.message || err.message || "Error al guardar el examen";
      setErrors({ 
        global: `Error: ${errorMsg}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="exam-form-wrapper">
      <div className="exam-form-container">
        <h2 className="exam-form-title">
          {editingExam ? "✏️ Editar Examen" : "➕ Crear Nuevo Examen"}
        </h2>

        {errors.global && (
          <div className="alert alert-error" role="alert">
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="exam-form">
          {/* CURSO */}
          <div className="form-section">
            <label htmlFor="courseId" className="form-label">
              Curso <span className="required">*</span>
            </label>
            <select
              id="courseId"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              onBlur={() => handleBlur("courseId")}
              className={`form-input form-select ${errors.courseId ? "error" : ""}`}
              aria-invalid={Boolean(errors.courseId)}
              aria-describedby={errors.courseId ? "courseId-error" : undefined}
            >
              <option value="">-- Seleccionar Curso --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <div className="form-error" id="courseId-error">{errors.courseId}</div>
            )}
          </div>

          {/* LECCIÓN */}
          <div className="form-section">
            <label htmlFor="lessonId" className="form-label">
              Lección <span className="optional">(opcional)</span>
            </label>
            <select
              id="lessonId"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="form-input form-select"
            >
              <option value="">-- Sin Lección --</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          {/* PREGUNTA */}
          <div className="form-section">
            <label htmlFor="question" className="form-label">
              Pregunta <span className="required">*</span>
            </label>
            <textarea
              id="question"
              value={formData.question}
              onChange={handleQuestionChange}
              onBlur={() => handleBlur("question")}
              placeholder="Escribe una pregunta clara y completa..."
              className={`form-input form-textarea ${errors.question ? "error" : ""}`}
              rows="3"
              maxLength="500"
              aria-invalid={Boolean(errors.question)}
              aria-describedby={errors.question ? "question-error" : undefined}
            />
            <div className="char-counter">
              {formData.question.length}/500 caracteres
            </div>
            {errors.question && (
              <div className="form-error" id="question-error">{errors.question}</div>
            )}
          </div>

          {/* DESCRIPCIÓN OPCIONAL */}
          <div className="form-section">
            <label htmlFor="description" className="form-label">
              Explicación <span className="optional">(opcional)</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Explicación de la respuesta correcta..."
              className="form-input form-textarea"
              rows="2"
              maxLength="300"
            />
          </div>

          {/* OPCIONES */}
          <div className="form-section">
            <div className="options-header">
              <label className="form-label">
                Opciones de Respuesta <span className="required">*</span>
              </label>
              <span className="options-counter">
                {formData.options.filter(o => o.text.trim()).length}/{MAX_OPTIONS}
              </span>
            </div>

            {errors.options && (
              <div className="form-error" style={{ marginBottom: "1rem" }}>
                {errors.options}
              </div>
            )}

            <div className="options-list">
              {formData.options.map((option, idx) => (
                <div key={option.id} className="option-item">
                  <div className="option-radio-wrapper">
                    <input
                      type="radio"
                      id={`option-correct-${option.id}`}
                      name="correct-option"
                      value={option.id}
                      checked={formData.correctAnswer === option.id}
                      onChange={() => handleCorrectAnswerChange(option.id)}
                      className="option-radio"
                      aria-label={`Marcar como respuesta correcta: opción ${idx + 1}`}
                    />
                    <label 
                      htmlFor={`option-correct-${option.id}`}
                      className="radio-label"
                    >
                      Correcta
                    </label>
                  </div>

                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    onBlur={() => handleBlur(`option_${idx}`)}
                    placeholder={`Opción ${String.fromCharCode(65 + idx)}...`}
                    className={`form-input option-input ${errors[`option_${idx}`] ? "error" : ""}`}
                    maxLength="150"
                    aria-label={`Opción ${idx + 1}`}
                    aria-invalid={Boolean(errors[`option_${idx}`])}
                  />

                  {formData.options.length > MIN_OPTIONS && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="btn-remove-option"
                      aria-label={`Eliminar opción ${idx + 1}`}
                      title="Eliminar opción"
                    >
                      ✕
                    </button>
                  )}

                  {errors[`option_${idx}`] && (
                    <div className="form-error">{errors[`option_${idx}`]}</div>
                  )}
                </div>
              ))}
            </div>

            {formData.options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={addOption}
                className="btn-add-option"
                aria-label="Agregar nueva opción"
              >
                ➕ Agregar Opción
              </button>
            )}
          </div>

          {/* DIFICULTAD Y ORDEN */}
          <div className="form-row">
            <div className="form-section">
              <label htmlFor="difficulty" className="form-label">
                Dificultad
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="form-input form-select"
              >
                {DIFFICULTIES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="order" className="form-label">
                Orden
              </label>
              <input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                min="1"
                max="999"
                className="form-input"
              />
            </div>
          </div>

          {/* ERRORES CORRECTA */}
          {errors.correctAnswer && (
            <div className="alert alert-error">{errors.correctAnswer}</div>
          )}

          {/* BOTONES */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large"
              aria-busy={loading}
            >
              {loading ? "Guardando..." : (editingExam ? "Actualizar Examen" : "Crear Examen")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
