import { Link } from "react-router-dom";
import style from "./Chat.module.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const Chat = () => {
  const { store, dispatch } = useGlobalReducer();

  const handleRemoveChat = (e, chatId) => {
    e.preventDefault(); // Evita que el Link navegue al hacer clic en el botón
    const confirm = window.confirm("¿Eliminar este chat?");
    if (confirm) {
      dispatch({ type: "remove_chat", payload: chatId });
    }
  };

  return (
    <div className={style.chatContainer}>

      {/* HEADER */}
      <div className={style.header}>
        <h2>Chat</h2>
      </div>

      {/* LISTA VISUAL DE CHAT */}
      <div className={style.chatList}>
        {store.chats && store.chats.length > 0 ? (
          store.chats.map((chat) => (
            <Link key={chat.id} to={`/chat/${chat.id}`}>
              <div className={style.chatItem}>
                <div className={style.avatarWrapper}>
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className={style.avatar}
                  />
                  <span className={style.onlineDot}></span>
                </div>

                <div className={style.chatInfo}>
                  <div className={style.topRow}>
                    <h4>{chat.name}</h4>
                    <button
                      className={style.deleteButton}
                      onClick={(e) => handleRemoveChat(e, chat.id)}
                      title="Eliminar chat"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className={style.lastMessage}>{chat.lastMessage}</p>
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