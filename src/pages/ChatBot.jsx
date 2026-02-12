import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import sendChatMessage from "../api/chat";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hola, soy tu asistente. ¿En qué puedo ayudarte hoy?", time: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToEnd();
  }, [messages, fontSize]);

  const scrollToEnd = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ""; }
  };

  const leerEnVozAlta = (texto) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const send = async (textToSend = input) => {
    if (!textToSend.trim()) return;
    const now = new Date().toISOString();
    const userMsg = { role: "user", text: textToSend.trim(), time: now };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");
    try {
      const history = messages.concat(userMsg).map((m) => ({ role: m.role, content: m.text }));
      const data = await sendChatMessage(userMsg.text, history);

      let replyText = "Lo siento, no obtuve respuesta.";

      if (!data) {
        replyText = "No hay respuesta del servidor.";
      } else if (data.error) {
        replyText = `Error del servidor: ${data.error}. Posibles causas: servidor no configurado con OpenAI, sin créditos, o problema de red.`;
      } else {
        replyText = data.reply || data.message || replyText;
      }

      const replyMsg = { role: "assistant", text: replyText, time: new Date().toISOString() };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      const replyMsg = { role: "assistant", text: "Error inesperado. Intenta de nuevo más tarde.", time: new Date().toISOString() };
      setMessages((prev) => [...prev, replyMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const EXAMPLES = [
    "¿Cómo creo una cuenta?",
    "¿Dónde están mis cursos?",
    "¿Cómo usar la plataforma?",
  ];

  return (
    <div className="chatbot-page" style={{ fontSize: `${fontSize}px` }}>
      <div className="chatbot-intro">
        <h2 className="intro-title">Asistente de Ayuda Paso a Paso</h2>
        <p className="intro-desc">Haz clic en una pregunta de ejemplo o escribe la tuya abajo.</p>
        <div className="intro-examples">
          {EXAMPLES.map((ex, idx) => (
            <button key={idx} className="example-btn" onClick={() => send(ex)}>{ex}</button>
          ))}
        </div>
      </div>

      <div className="chatbot-panel">
        <header className="chatbot-header">
          <h1>Asistente Digital</h1>
          <div className="chatbot-controls">
            <button onClick={() => setFontSize((s) => Math.max(16, s - 2))}>A-</button>
            <button onClick={() => setFontSize((s) => Math.min(32, s + 2))}>A+</button>
            <button className="contrast-btn" onClick={() => document.body.classList.toggle('high-contrast')}>Ver mejor</button>
          </div>
        </header>

        <main className="chatbot-main">
          <ul className="messages">
            {messages.map((m, i) => (
              <li key={i} className={`message ${m.role}`}>
                <div className="avatar">{m.role === 'user' ? '👤' : '🤖'}</div>
                <div className="bubble">
                  <div className="role">{m.role === "user" ? "Tu pregunta" : "Respuesta del Asistente"}</div>
                  <div className="text">
                    {m.text.split("\n").map((line, idx) => (
                      <span key={idx}>{line}<br /></span>
                    ))}
                  </div>
                  <div className="message-actions">
                    <span className="timestamp">{formatTime(m.time)}</span>
                    {m.role === 'assistant' && (
                      <button className="audio-btn" onClick={() => leerEnVozAlta(m.text)}>
                        🔊 Escuchar respuesta
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {loading && (
              <li className="message assistant">
                <div className="avatar">🤖</div>
                <div className="bubble"><div className="text typing-animation">Escribiendo respuesta...</div></div>
              </li>
            )}
            <div ref={messagesEndRef} />
          </ul>
        </main>

        <form className="chatbot-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí tu duda..."
            rows={2}
          />
          <button type="submit" className="send-btn" disabled={loading}>
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;