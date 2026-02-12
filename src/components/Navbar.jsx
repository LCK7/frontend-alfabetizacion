import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (token) {
      // normalizar rol a minúsculas y proveer nombre por defecto
      const normalizedRole = userRole ? userRole.toLowerCase() : null;
      setUser({ name: userName || "Usuario", role: normalizedRole });

      // intentar refrescar rol/nombre desde la API para reflejar cambios en la BD
      if (userId) {
        api
          .get(`/auth/user/${userId}`, { headers: { Authorization: token } })
          .then((res) => {
            const fresh = res.data;
            if (fresh) {
              const freshRole = fresh.role ? fresh.role.toLowerCase() : null;
              localStorage.setItem("userRole", freshRole);
              localStorage.setItem("userName", fresh.name || "Usuario");
              setUser({ name: fresh.name || "Usuario", role: freshRole });
            }
          })
          .catch((err) => {
            // si hay error de autorización, limpiar sesión
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              localStorage.removeItem("userRole");
              localStorage.removeItem("userId");
              setUser(null);
              navigate("/login");
            }
          });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="logo-icon">📚</span>
        <h2>Alfabetización Digital</h2>
      </Link>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <Link to="/courses" className="nav-link">Cursos</Link>
        <Link to="/chatbot" className="nav-link">Asistente IA</Link>
      </div>

      <div className={`navbar-auth ${menuOpen ? "open" : ""}`}>
        {user ? (
          <div className={`user-menu ${menuOpen ? "open" : ""}`}>
            <span className="user-greeting">¡Hola, {user.name}!</span>
            {user.role === "admin" && (
              <Link to="/admin" className="btn-admin">
                👨‍💼 Panel Admin
              </Link>
            )}
            <Link to="/dashboard" className="btn-secondary">
              Mi Progreso
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Salir
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-outline">
              Ingresar
            </Link>
            <Link to="/register" className="btn-primary">
              Registrarse
            </Link>
          </div>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
}
