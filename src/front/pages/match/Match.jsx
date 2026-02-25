import { useNavigate, useLocation } from "react-router-dom";
import style from "./Match.module.css";

export const Match = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChat = location.pathname.includes("/chat");
  const isMatch = location.pathname.includes("/match");

  return (
    <div className={style.matchContainer}>
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

      <div className={style.matchContent}>
        {/* Aquí iria la lógica... SI TUVIERA UNA! */}

      </div>

    </div>
  );
};
