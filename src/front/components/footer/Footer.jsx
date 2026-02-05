import { useNavigate } from "react-router-dom";
import style from "./Footer.module.css";
import { useState } from "react";

export const Footer = () => {
  // Estado para controlar qué icono está activo
  const [activeIcon, setActiveIcon] = useState('home');
  const navigate = useNavigate();
  
  // Estado para notificaciones (opcional)
  const [hasNotifications, setHasNotifications] = useState({
    messages: true,
    flags: false
  });
  
  // Manejar clic en los iconos
  const handleIconClick = (iconName) => {
    console.log(`${iconName} icon clicked`);
    setActiveIcon(iconName);
    
    // Acciones específicas para cada icono
    switch(iconName) {
      case 'home':
        // Navegar a home
        navigate("/")
        break;
      case 'search':
        // Abrir búsqueda
        navigate("/search")
        break;
      case 'flag':
        // Ver banderas/marcadores
        alert("Mostrando marcadores/banderas");
        break;
      case 'message':
        // Abrir mensajería
        navigate("/chat")
        break;
      case 'settings':
        // Abrir configuración
        navigate("/configuration")
        break;
    }
  };
  
  return (
    <footer className={style.footer}>
      <div className={style.iconsContainer}>
        {/* Icono 1: Home (Inicio) */}
        <div 
          className={`${style.icon} ${activeIcon === 'home' ? style.active : ''}`}
          onClick={() => handleIconClick('home')}
          title="Inicio"
        >
          <i className="fas fa-home"></i>
          <span className={style.iconLabel}></span>
        </div>
        
        {/* Icono 2: Search (Búsqueda) */}
        <div 
          className={`${style.icon} ${activeIcon === 'search' ? style.active : ''}`}
          onClick={() => handleIconClick('search')}
          title="Buscar"
        >
          <i className="fas fa-search"></i>
          <span className={style.iconLabel}></span>
        </div>
        
        {/* Icono 3: Flag (Bandera/Marcadores) */}
        <div 
          className={`${style.icon} ${activeIcon === 'flag' ? style.active : ''} ${hasNotifications.flags ? style.hasNotification : ''}`}
          onClick={() => handleIconClick('flag')}
          title="Marcadores"
        >
          <i className="fas fa-flag"></i>
          <span className={style.iconLabel}></span>
        </div>
        
        {/* Icono 4: Message (Mensajería) */}
        <div 
          className={`${style.icon} ${activeIcon === 'message' ? style.active : ''} ${hasNotifications.messages ? style.hasNotification : ''}`}
          onClick={() => handleIconClick('message')}
          title="Mensajes"
        >
          <i className="fas fa-comment-dots"></i>
          <span className={style.iconLabel}></span>
        </div>
        
        {/* Icono 5: Settings (Opciones/Configuración) */}
        <div 
          className={`${style.icon} ${activeIcon === 'settings' ? style.active : ''}`}
          onClick={() => handleIconClick('settings')}
          title="Configuración"
        >
          <i className="fa-solid fa-ellipsis"></i>
          <span className={style.iconLabel}></span>
        </div>
      </div>
    </footer>
  );
};
