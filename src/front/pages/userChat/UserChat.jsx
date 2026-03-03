import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./UserChat.module.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export function UserChat() {
    const [text, setText] = useState("");
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const { chatId } = useParams();

    const chatInfo = store.chats?.find(chat => String(chat.id) === String(chatId));

    // ✅ Mensajes del chat actual desde el store
    const messages = store.chatMessages?.[chatId] || [];

    const handleBack = () => navigate(-1);

    const handleSendMessage = () => {
        if (text.trim()) {
            dispatch({
                type: "send_message",
                payload: {
                    chatId,
                    message: {
                        id: Date.now(),
                        text: text.trim(),
                        from: "user",
                    },
                },
            });
            setText("");
        }
    };

    return (
        <div className={styles.chatContainer}>

            {/* Cabecera */}
            <div className={styles.upperName}>
                <button className={styles.backButton} onClick={handleBack}>←</button>
                <div>
                    <h1>{chatInfo?.name || `Chat ${chatId || "desconocido"}`}</h1>
                    <span className={styles.status}>En línea</span>
                </div>
            </div>

            {/* Zona de Mensajes */}
            <div className={styles.chatMessages}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`${styles.messageGroup} ${msg.from === "user" ? styles.userMessage : styles.otherMessage}`}
                    >
                        <span
                            className={styles.nameLabel}
                            style={{ color: msg.from === "user" ? "#075e54" : "#128c7e" }}
                        >
                            {msg.from === "user" ? "Tú" : chatInfo?.name || `Usuario ${chatId}`}
                        </span>
                        <div>{msg.text}</div>
                    </div>
                ))}
            </div>

            {/* Barra de Entrada */}
            <div className={styles.chatInputContainer}>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="Escribe un mensaje"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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