import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./UserChat.module.css";
import { supabase } from "../../supabaseClient";

export function UserChat() {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatInfo, setChatInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { chatId } = useParams();
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cargar info del chat y mensajes al entrar
    useEffect(() => {
        console.log("chatId en useEffect:", chatId);
        console.log("currentUser en useEffect:", currentUser?.id);

        const fetchMessages = async () => {
            try {
                console.log("chatId:", chatId);
                const response = await fetch(`${backendUrl}/api/user/chats/${chatId}/messages`);
                console.log("Status messages:", response.status);

                const data = await response.json();
                console.log("Respuesta mensajes:", data);

                if (!response.ok) throw new Error("Error al cargar mensajes");
                setMessages(data);
            } catch (error) {
                console.error("Error al cargar mensajes:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchChatInfo = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user/chats/${currentUser.id}`);
                if (!response.ok) throw new Error("Error al cargar info del chat");
                const data = await response.json();
                console.log("Respuesta info del chat:", data);
                const chat = data.find(c => String(c.chat_id) === String(chatId));
                if (chat) setChatInfo(chat.matched_user);
            } catch (error) {
                console.error("Error al cargar info del chat:", error);
            }
        };

        if (chatId && currentUser?.id) {
            fetchMessages();
            fetchChatInfo();
        } else {
            setLoading(false);
        }
    }, [chatId]);

    // Supabase Realtime - escuchar mensajes nuevos
    useEffect(() => {
        const channel = supabase
            .channel(`chat:${chatId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    const newMessage = payload.new;
                    // Evitar duplicados si el mensaje ya fue añadido optimistamente
                    setMessages(prev => {
                        const exists = prev.some(m => m.id === newMessage.id);
                        if (exists) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);

    const handleBack = () => navigate(-1);

    const handleSendMessage = async () => {
        if (!text.trim()) return;

        const content = text.trim();
        setText("");

        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            chat_id: chatId,
            sender_id: currentUser.id,
            content,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const response = await fetch(`${backendUrl}/api/user/chats/${chatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender_id: currentUser.id,
                    content
                })
            });
            const data = await response.json();
            console.log("Respuesta enviar:", data);
            if (!response.ok) throw new Error("Error al enviar mensaje");

        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
            setText(content);
        }
    };

    if (loading) {
        return (
            <div className={styles.chatContainer}>
                <div className={styles.upperName}>
                    <button className={styles.backButton} onClick={handleBack}>←</button>
                    <div><h1>Cargando...</h1></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>

            {/* Cabecera */}
            <div className={styles.upperName}>
                <button className={styles.backButton} onClick={handleBack}>←</button>
                <div>
                    <h1>{chatInfo?.name || "Chat"}</h1>
                    <span className={styles.status}>En línea</span>
                </div>
            </div>

            {/* Zona de Mensajes */}
            <div className={styles.chatMessages}>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`${styles.messageGroup} ${msg.sender_id === currentUser.id ? styles.userMessage : styles.otherMessage}`}
                    >
                        <span
                            className={styles.nameLabel}
                            style={{ color: msg.sender_id === currentUser.id ? "#075e54" : "#128c7e" }}
                        >
                            {msg.sender_id === currentUser.id ? "Tú" : chatInfo?.name || "Usuario"}
                        </span>
                        <div>{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
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