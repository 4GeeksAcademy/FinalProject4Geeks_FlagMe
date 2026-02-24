import { useState } from "react";
import styles from "./UserChat.module.css"; // Importación esencial para CSS Modules

export function UserChat() {
    const [text, setText] = useState("");

    return (
        <div className={styles.chatContainer}>
            {/* Cabecera Estilo WhatsApp */}
            <div className={styles.upperName}>
                <button className={styles.backButton}>←</button>
                <h1>Nombre del Contacto</h1>
            </div>

            {/* Zona de Mensajes */}
            <div className={styles.chatMessages}>
                
                {/* Mensaje Recibido */}
                <div className={`${styles.messageGroup} ${styles.otherMessage}`}>
                    <span className={styles.nameLabel}>Nombre</span>
                    <div>¡Hola! ¿Cómo vas con el código? 🚀</div>
                </div>

                {/* Mensaje Enviado */}
                <div className={`${styles.messageGroup} ${styles.userMessage}`}>
                    <span className={styles.nameLabel} style={{color: '#075e54'}}>Tú</span>
                    <div>¡Ya casi está listo! Estoy aplicando los CSS Modules ahora mismo.</div>
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
                />
                <button className={styles.sendButton}>
                    ➤
                </button>
            </div>
        </div>
    );
}