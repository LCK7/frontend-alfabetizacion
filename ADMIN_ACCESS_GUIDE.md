# 📚 Guía de Acceso al Dashboard de Administrador

## ¿Cómo Crear Cursos y Guías?

### Paso 1️⃣: Inicia Sesión como Administrador
Para acceder al panel de administración, debes contar con una cuenta con rol de administrador.

**URL de Login:** `http://localhost:5174/login`

**Credenciales de Administrador:**
- Email: `admin@example.com`
- Password: `admin123`

> ℹ️ Si aún no tienes una cuenta de admin, crea una y luego actualiza el rol en la base de datos.

---

### Paso 2️⃣: Navega al Dashboard desde el Navbar
Una vez que hayas iniciado sesión como administrador, verás:

1. En la **Barra de Navegación (Navbar)**: 
   - Se mostrará tu nombre de usuario
   - Aparecerá un botón **"Panel Admin"** en la navegación
   - Haz clic en él para acceder al dashboard

2. **O accede directamente:**
   - URL: `http://localhost:5174/admin`

---

### Paso 3️⃣: En la Página de Cursos
También verás un **Banner Especial para Administradores** en la página `/courses`:

```
👨‍💼 Panel de Administrador
Puedes crear y gestionar cursos desde aquí
[Ir al Dashboard →]
```

Haz clic en el botón para ir al panel completo.

---

## 📋 Panel de Administración - Funcionalidades

### Crear un Nuevo Curso
1. Ve a `/admin`
2. En la sección derecha, haz clic en **"➕ Nuevo Curso"**
3. Completa el formulario:
   - **Título**: Nombre del curso (ej: "Aprender a usar WhatsApp")
   - **Descripción**: Explicación breve del curso
   - **Nivel**: Selecciona el nivel (Básico, Intermedio, Avanzado)
4. Haz clic en **"Guardar Curso"**

### Agregar Lecciones a un Curso
1. Selecciona un curso de la lista de la izquierda
2. En la sección de lecciones, haz clic en **"➕ Nueva Lección"**
3. Completa el formulario:
   - **Título**: Nombre de la lección
   - **Contenido**: Explicación paso a paso
   - **URL del Video** (opcional): Link a un video instructivo
   - **Orden**: Número para determinar el orden de las lecciones
4. Haz clic en **"Guardar Lección"**

### Editar o Eliminar
- **Editar**: Haz clic en el ícono ✏️ de cualquier curso o lección
- **Eliminar**: Haz clic en el ícono 🗑️ (aparecerá una confirmación)

---

## 🎯 Rol de Usuario vs Administrador

### Usuario Normal (Estudiante)
- ✅ Puede ver todos los cursos publicados
- ✅ Puede acceder a las lecciones
- ✅ Puede guardar progreso
- ❌ No puede crear ni editar cursos

### Administrador
- ✅ Puede ver todos los cursos
- ✅ Puede **crear nuevos cursos**
- ✅ Puede **agregar lecciones** a los cursos
- ✅ Puede **editar** cursos y lecciones
- ✅ Puede **eliminar** cursos y lecciones
- ✅ Tiene acceso al panel de administración

---

## 🔧 Requisitos Técnicos

**Para usar el dashboard, necesitas:**
1. Backend corriendo en `http://localhost:5000`
2. Frontend corriendo en `http://localhost:5174`
3. Base de datos PostgreSQL configurada
4. Usuario con rol "admin" en la BD

---

## ⚠️ Troubleshooting

**P: No veo el botón "Panel Admin" en el Navbar**
- A: Verifica que hayas iniciado sesión y que tu rol en la BD sea "admin"

**P: No puedo crear cursos**
- A: Asegúrate de estar registrado como administrador en la base de datos

**P: Los cursos no aparecen después de crearlos**
- A: Recarga la página (F5) o espera a que se actualice automáticamente

**P: ¿Cómo cambio el rol de un usuario a admin?**
- A: Accede a la base de datos directamente y actualiza el campo `role` a "admin"

---

## 📞 Resumen Visual

```
HOME (/)
  ↓
COURSES (/courses) ← Ver todos los cursos + banner admin
  ↓
NAVBAR → Panel Admin → ADMIN DASHBOARD (/admin) ← Crear y gestionar cursos
  ↓
LOGIN (/login) ← Inicia sesión si no estás autenticado
```

---

**¡Listo! Ya puedes crear cursos y guías para tus estudiantes adultos mayores. 🎓**
