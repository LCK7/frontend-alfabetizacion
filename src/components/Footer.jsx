import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <h3>📚 Alfabetización Digital</h3>

      <p>
        Plataforma diseñada para ayudar a adultos mayores a aprender tecnología
        paso a paso.
      </p>

      <div className="footer-links">
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Contacto</a>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Universidad Continental - Proyecto Académico
      </p>
    </footer>
  );
}
