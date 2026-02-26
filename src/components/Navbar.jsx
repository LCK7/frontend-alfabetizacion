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
      const normalizedRole = userRole ? userRole.toLowerCase() : null;
      setUser({ name: userName || "Usuario", role: normalizedRole });

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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="logo-icon">📚</span>
          <h2>Alfabetización Digital</h2>
        </Link>

        {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <div className="nav-links">
            <Link to="/courses" className="nav-link" onClick={closeMenu}>Cursos</Link>
            <Link to="/chatbot" className="nav-link" onClick={closeMenu}>Asistente IA</Link>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-section">
                <span className="user-greeting">¡Hola, {user.name}!</span>
                <div className="user-actions">
                  {user.role === "admin" && (
                    <>
                      <Link to="/admin" className="btn-admin-nav" onClick={closeMenu}>
                        👨‍💼 Panel Admin
                      </Link>
                      <Link to="/admin/exams" className="btn-admin-nav" onClick={closeMenu}>
                        📝 Administrar Exámenes
                      </Link>
                    </>
                  )}
                  <Link to="/dashboard" className="btn-progreso-nav" onClick={closeMenu}>
                    Mi Progreso
                  </Link>
                  <button onClick={handleLogout} className="btn-logout-nav">
                    Salir
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-outline-nav" onClick={closeMenu}>
                  Ingresar
                </Link>
                <Link to="/register" className="btn-primary-nav" onClick={closeMenu}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}