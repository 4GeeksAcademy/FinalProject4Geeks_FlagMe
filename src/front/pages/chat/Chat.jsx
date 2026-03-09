import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Chat.module.css";

export const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/user/chats/${currentUser.id}`);

        const data = await response.json();
        console.log("Respuesta mensajes:", data);

        if (!response.ok) throw new Error("Error al cargar chats");

        setChats(data);
      } catch (error) {
        console.error("Error al cargar chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) fetchChats();
  }, []);

  if (loading) {
    return (
      <div className={style.chatContainer}>
        <div className={style.header}><h2>Chat</h2></div>
        <div className={style.emptyState}><p>Cargando chats...</p></div>
      </div>
    );
  }

  return (
    <div className={style.chatContainer}>

      <div className={style.header}>
        <h2>Chat</h2>
      </div>

      <div className={style.chatList}>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link key={chat.chat_id} to={`/chat/${chat.chat_id}`}>
              <div className={style.chatItem}>
                <div className={style.avatarWrapper}>
                  <img
                    src={chat.matched_user.profile_pic || "https://via.placeholder.com/60"}
                    alt={chat.matched_user.name}
                    className={style.avatar}
                  />
                  <span className={style.onlineDot}></span>
                </div>

                <div className={style.chatInfo}>
                  <div className={style.topRow}>
                    <h4>{chat.matched_user.name}</h4>
                    <span className={style.time}>
                      {chat.last_message?.created_at
                        ? new Date(chat.last_message.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : ""}
                    </span>
                  </div>
                  <p className={style.lastMessage}>
                    {chat.last_message?.text || "¡Es un match! Di hola 👋"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className={style.emptyState}>
            <p>No tienes chats aún. ¡Empieza a conectar con nuevas personas!</p>
          </div>
        )}
      </div>

    </div>
  );
};