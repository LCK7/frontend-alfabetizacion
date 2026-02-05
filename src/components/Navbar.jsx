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
      setUser({ name: userName, role: userRole });

      if (userId) {
        api
          .get(`/auth/user/${userId}`, { headers: { Authorization: token } })
          .then((res) => {
            const fresh = res.data;
            if (fresh) {
              localStorage.setItem("userRole", fresh.role);
              localStorage.setItem("userName", fresh.name);
              setUser({ name: fresh.name, role: fresh.role });
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              handleLogout();
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
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="logo-icon">📚</span>
        <h2>Alfabetización Digital</h2>
      </Link>

      {/* Navegación Central Ampliada */}
      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/courses" className="nav-link" onClick={() => setMenuOpen(false)}>Cursos</Link>
        <Link to="/chatbot" className="nav-link" onClick={() => setMenuOpen(false)}>Asistente IA</Link>
        <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>Nosotros</Link>
        <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Ayuda</Link>
      </div>

      <div className={`navbar-auth ${menuOpen ? "open" : ""}`}>
        {user ? (
          <div className="user-menu">
            <span className="user-greeting">¡Hola, {user.name}!</span>
            {user.role === "admin" && (
              <Link to="/admin" className="btn-admin" onClick={() => setMenuOpen(false)}>
                Panel
              </Link>
            )}
            <Link to="/dashboard" className="btn-secondary" onClick={() => setMenuOpen(false)}>
              Mi Progreso
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Salir
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-outline" onClick={() => setMenuOpen(false)}>
              Ingresar
            </Link>
            <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>
              Registrarse
            </Link>
          </div>
        )}
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        {menuOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
}