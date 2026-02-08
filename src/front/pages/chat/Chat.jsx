import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "./Chat.module.css";

export const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para chats
  const exampleChats = [
    {
      id: 1,
      name: "Juan Sánchez",
      avatar: "JS",
      lastMessage: "¡Nos vemos mañana en la oficina!",
      time: "10:30",
      unread: 3,
      online: true,
      muted: false,
    },
    {
      id: 2,
      name: "María González",
      avatar: "MG",
      lastMessage: "Te envié el documento que me pediste 📄",
      time: "09:45",
      unread: 0,
      online: true,
      muted: true,
    },
    {
      id: 3,
      name: "Grupo Familia",
      avatar: "👨‍👩‍👧",
      lastMessage: "Ana: ¿Quién hace la compra este finde?",
      time: "Ayer",
      unread: 12,
      online: false,
      muted: false,
      isGroup: true,
    },
    {
      id: 4,
      name: "Carlos Ruiz",
      avatar: "CR",
      lastMessage: "Perfecto, gracias por la ayuda 👍",
      time: "Ayer",
      unread: 0,
      online: false,
      muted: false,
    },
    {
      id: 5,
      name: "Laura Martínez",
      avatar: "LM",
      lastMessage: "¿Has visto la última película de Marvel?",
      time: "Mar",
      unread: 1,
      online: true,
      muted: false,
    },
    {
      id: 6,
      name: "Soporte Técnico",
      avatar: "🔧",
      lastMessage: "Tu ticket #4567 ha sido resuelto",
      time: "Lun",
      unread: 0,
      online: false,
      muted: true,
    },
    {
      id: 7,
      name: "Equipo Desarrollo",
      avatar: "💻",
      lastMessage: "Pedro: La reunión de mañana se cancela",
      time: "Dom",
      unread: 5,
      online: false,
      muted: false,
      isGroup: true,
    },
    {
      id: 8,
      name: "David López",
      avatar: "DL",
      lastMessage: "¡Feliz cumpleaños! 🎂",
      time: "Vie",
      unread: 0,
      online: false,
      muted: false,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setChats(exampleChats);
      setLoading(false);
    }, 800);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    navigate("/new-chat");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const SkeletonItem = () => (
    <div className={style.chatItem}>
      <div className={`${style.skeletonAvatar} ${style.skeleton}`}></div>
      <div className={style.chatContent}>
        <div className={`${style.skeletonText} ${style.short} ${style.skeleton}`}></div>
        <div className={`${style.skeletonText} ${style.medium} ${style.skeleton}`}></div>
      </div>
    </div>
  );

  return (
    <div className={style.chatContainer}>
      {/* Header */}
      <header className={style.chatHeader}>
        <div className={style.headerTop}>
          <h1 className={style.headerTitle}>Chats</h1>
          <div className={style.headerActions}>
            <button className={style.iconButton} onClick={handleSettings} aria-label="Configuración">
              <svg viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>
            <button className={style.iconButton} aria-label="Nuevo grupo">
              <svg viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Barra de búsqueda */}
        <div className={style.searchContainer}>
          <svg className={style.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            className={style.searchInput}
            placeholder="Buscar chats..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* Lista de chats */}
      <main className={style.chatList}>
        {loading ? (
          // Skeleton loading
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))
        ) : filteredChats.length === 0 ? (
          // Estado vacío
          <div className={style.emptyState}>
            <svg className={style.emptyIcon} viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            </svg>
            <h2>No hay chats</h2>
            <p>{searchTerm ? "No se encontraron chats con esa búsqueda" : "Comienza una conversación creando un nuevo chat"}</p>
          </div>
        ) : (
          // Lista de chats
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={style.chatItem}
              onClick={() => handleChatClick(chat.id)}
            >
              <div className={style.chatAvatar}>
                <div className={style.avatarImage}>
                  {chat.avatar}
                </div>
                {chat.online && <div className={style.onlineIndicator}></div>}
              </div>
              
              <div className={style.chatContent}>
                <div className={style.chatHeader}>
                  <h3 className={style.chatName}>{chat.name}</h3>
                  <span className={style.chatTime}>{chat.time}</span>
                </div>
                
                <div className={style.chatPreview}>
                  {chat.muted && (
                    <svg className={style.mutedIcon} viewBox="0 0 24 24">
                      <path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  )}
                  <p className={style.chatMessage}>{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className={style.unreadBadge}>
                      {chat.unread > 99 ? "99+" : chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Botón flotante para nuevo chat */}
      <button className={style.newChatButton} onClick={handleNewChat} aria-label="Nuevo chat">
        <svg viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    </div>
  );
};