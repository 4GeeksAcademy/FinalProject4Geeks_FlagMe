import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./UserChat.module.css";

export function UserChat() {
    const [text, setText] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extraemos los posibles IDs de la URL según la ruta definida en App.jsx
    const { chatId, matchId } = useParams();
    const activeId = chatId || matchId;

    // Lógica para saber en qué sección estamos
    const isChat = location.pathname.includes("/chat");
    const isMatch = location.pathname.includes("/match");

    const handleBack = () => {
        navigate(-1); // Regresa a la pantalla anterior
    };

    const handleSendMessage = () => {
        if (text.trim()) {
            console.log(`Enviando mensaje a ${activeId}: ${text}`);
            setText(""); // Limpiar input tras enviar
        }
    };

    return (
        <div className={styles.chatContainer}>
            {/* Cabecera Estilo WhatsApp */}
            <div className={styles.upperName}>
                <button className={styles.backButton} onClick={handleBack}>
                    ←
                </button>
                <div>
                    <h1>{isMatch ? "Match con:" : "Chat:"} {activeId}</h1>
                    <span className={styles.status}>En línea</span>
                </div>
            </div>

            {/* Zona de Mensajes */}
            <div className={styles.chatMessages}>
                
                {/* Mensaje Recibido */}
                <div className={`${styles.messageGroup} ${styles.otherMessage}`}>
                    <span className={styles.nameLabel}>Usuario {activeId}</span>
                    <div>¡Hola! ¿Cómo vas con el código? 🚀</div>
                </div>

                {/* Mensaje Enviado */}
                <div className={`${styles.messageGroup} ${styles.userMessage}`}>
                    <span className={styles.nameLabel} style={{ color: '#075e54' }}>Tú</span>
                </div>

            </div>

            {/* Barra de Entrada */}
            <div className={styles.chatInputContainer}>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="Escribe un mensaje"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                    className={styles.sendButton} 
                    onClick={handleSendMessage}
                    disabled={!text.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}