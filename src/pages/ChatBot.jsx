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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollToEnd();
    // Verificar soporte de voz
    if (typeof window !== 'undefined') {
      const hasSpeech = 'speechSynthesis' in window && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
      setSpeechSupported(hasSpeech);
      
      if (hasSpeech) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          setTimeout(() => send(transcript), 500);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, [messages, fontSize]);

  const scrollToEnd = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ""; }
  };

  const leerEnVozAlta = (texto) => {
    if (!speechSupported) return;
    
    // Detener cualquier reproducción actual
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const detenerVoz = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  
  const iniciarEscucha = () => {
    if (!speechSupported || !recognitionRef.current) return;
    
    setIsListening(true);
    recognitionRef.current.start();
  };
  
  const detenerEscucha = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
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
    "¿Cómo creo una cuenta de correo?",
    "¿Dónde encuentro mis cursos?",
    "¿Cómo uso WhatsApp?",
    "¿Qué es la banca móvil?",
    "¿Cómo hago videollamadas?",
    "¿Cómo protejo mi información?",
    "¿Cómo ajusto el tamaño de letra?",
    "¿Qué es Facebook?",
  ];

  return (
    <div className="chatbot-page" style={{ fontSize: `${fontSize}px` }}>
      {/* Partículas flotantes animadas */}
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      
      <div className="chatbot-intro">
        <h2 className="intro-title">Asistente de Ayuda Paso a Paso</h2>
        <p className="intro-desc">Escribe tu duda o usa las preguntas sugeridas abajo.</p>
      </div>

      <div className="chatbot-panel">
        <header className="chatbot-header">
          <h1>Asistente Digital</h1>
          <div className="chatbot-controls">
            <button onClick={() => setFontSize((s) => Math.max(16, s - 2))} title="Disminuir tamaño de letra">A-</button>
            <button onClick={() => setFontSize((s) => Math.min(32, s + 2))} title="Aumentar tamaño de letra">A+</button>
            <button className="contrast-btn" onClick={() => document.body.classList.toggle('high-contrast')} title="Modo alto contraste">👁️ Ver mejor</button>
            {speechSupported && (
              <>
                <button 
                  className={`voice-btn ${isListening ? 'listening' : ''}`} 
                  onClick={isListening ? detenerEscucha : iniciarEscucha}
                  title={isListening ? "Detener escucha" : "Hablar en lugar de escribir"}
                >
                  🎤 {isListening ? "Escuchando..." : "Hablar"}
                </button>
                <button 
                  className={`voice-btn ${isSpeaking ? 'speaking' : ''}`}
                  onClick={isSpeaking ? detenerVoz : () => leerEnVozAlta(messages[messages.length - 1]?.text)}
                  title={isSpeaking ? "Detener voz" : "Escuchar última respuesta"}
                >
                  🔊 {isSpeaking ? "Deteniendo..." : "Escuchar"}
                </button>
              </>
            )}
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
                    {m.role === 'assistant' && speechSupported && (
                      <button 
                        className={`audio-btn ${isSpeaking ? 'speaking' : ''}`} 
                        onClick={() => leerEnVozAlta(m.text)}
                        title="Escuchar esta respuesta en voz alta"
                      >
                        🔊 Escuchar
                      </button>
                    )}
                    {m.role === 'assistant' && (
                      <button 
                        className="copy-btn" 
                        onClick={() => {
                          navigator.clipboard.writeText(m.text);
                          alert('¡Respuesta copiada al portapapeles!');
                        }}
                        title="Copiar respuesta"
                      >
                        📋 Copiar
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
        
        {/* Preguntas sugeridas en la parte inferior */}
        <div className="suggested-questions">
          <p className="suggestions-title">O prueba estas preguntas:</p>
          <div className="suggestions-grid">
            {EXAMPLES.map((ex, idx) => (
              <button key={idx} className="suggestion-btn" onClick={() => send(ex)}>{ex}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;