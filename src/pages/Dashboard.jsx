import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>📌 Panel Principal</h1>

      <p>Bienvenido a tu avance de alfabetización digital.</p>

      <Link to="/courses">
        <button>Ver Cursos</button>
      </Link>

      <Link to="/chatbot">
        <button>Bot Guía IA</button>
      </Link>
    </div>
  );
}
