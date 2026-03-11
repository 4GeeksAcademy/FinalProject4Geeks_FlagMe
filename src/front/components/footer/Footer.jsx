import { useNavigate, useLocation } from "react-router-dom";
import style from "./Footer.module.css";
import { useState } from "react";

export const Footer = () => {
  const [activeIcon, setActiveIcon] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenRoutes = ["/userprofile", "/login", "/register"];

  const shouldHide = hiddenRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  if (shouldHide) return null;

  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
    switch(iconName) {
      case 'home':
        navigate("/");
        break;
      case 'flag':
        navigate("/flag");
        break;
      case 'message':
        navigate("/chat");
        break;
    }
  };

  return (
    <footer className={style.footer}>
      <div className={style.iconsContainer}>

        <div
          className={`${style.icon} ${activeIcon === 'home' ? style.active : ''}`}
          onClick={() => handleIconClick('home')}
          title="Inicio"
        >
          <i className="fas fa-home"></i>
          <span className={style.iconLabel}></span>
        </div>

        <div
          className={`${style.icon} ${activeIcon === 'flag' ? style.active : ''}`}
          onClick={() => handleIconClick('flag')}
          title="Marcadores"
        >
          <i className="fas fa-flag"></i>
          <span className={style.iconLabel}></span>
        </div>

        <div
          className={`${style.icon} ${activeIcon === 'message' ? style.active : ''}`}
          onClick={() => handleIconClick('message')}
          title="Mensajes"
        >
          <i className="fas fa-comment-dots"></i>
          <span className={style.iconLabel}></span>
        </div>

      </div>
    </footer>
  );
};