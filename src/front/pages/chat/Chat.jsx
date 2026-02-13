import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "./Chat.module.css";

export const Chat = () => {
  const navigate = useNavigate();

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className={style.chatContainer}>
      <div className={style.header}>Chat</div>

      <div className={style.chatList}>
        <div className={style.chatItem}>
          <div className={style.avatarWrapper}>
            <img className={style.avatar} />
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
      </div>
    </div>

  );
};