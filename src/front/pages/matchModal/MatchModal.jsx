import styles from "./MatchModal.module.css";
import { useNavigate } from "react-router-dom";

export const MatchModal = ({ user, onClose }) => {
    if (!user) return null;

    const navigate = useNavigate();

    const handleSendMessage = () => {
        onClose();
        navigate("/chat");
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.hearts}>💖</div>
                <h1 className={styles.title}>¡Es un Match!</h1>
                <p className={styles.subtitle}>Tú y {user.name} se han gustado</p>
                <img
                    src={user.image}
                    alt={user.name}
                    className={styles.avatar}
                />
                <div className={styles.buttons}>
                    <button className={styles.messageButton} onClick={handleSendMessage}>
                        Enviar mensaje
                    </button>
                    <button className={styles.closeButton} onClick={onClose}>
                        Seguir explorando
                    </button>
                </div>
            </div>
        </div>
    );
};