import { useNavigate, useLocation, Link } from "react-router-dom";
import style from "./Chat.module.css";

export const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChat = location.pathname.includes("/chat");
  const isMatch = location.pathname.includes("/match");

  return (
    <div className={style.chatContainer}>

      {/* HEADER CON SWITCH */}
      <div className={style.switchHeader}>
        <div
          className={`${style.switchItem} ${isChat ? style.active : ""}`}
          onClick={() => navigate("/chat")}
        >
          Chat
        </div>

        <div className={style.divider}></div>

        <div
          className={`${style.switchItem} ${isMatch ? style.active : ""}`}
          onClick={() => navigate("/match")}
        >
          Match
        </div>
      </div>

      {/* LISTA VISUAL DE CHAT */}
      <div className={style.chatList}>

        <Link to={`/chat/2`}>

          <div className={style.chatItem}>
            <div className={style.avatarWrapper}>
              <div className={style.avatar}></div>
              <span className={style.onlineDot}></span>
            </div>

            <div className={style.chatInfo}>
              <div className={style.topRow}>
                <h4>Carla Rodriguez</h4>
                <span className={style.time}>7:43pm</span>
              </div>
              <p className={style.lastMessage}>¿Cómo te va?</p>
            </div>
          </div>
          
        </Link>

      </div>

    </div>
  );
};
