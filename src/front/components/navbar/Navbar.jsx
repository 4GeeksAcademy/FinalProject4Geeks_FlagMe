import style from "./Navbar.module.css";
import { useState } from "react";

export const Navbar = () => {
  
  const handleLeftIconClick = () => {
    console.log("Icono izquierdo clickeado");
    alert("Icono izquierdo: Aquí iría la lógica para insertar una foto");
  };
  
  const handleRightIconClick = () => {
    console.log("Icono derecho clickeado");
    alert("Icono derecho clickeado");
  };

  return (
    <nav className={style.navbar}>
      <div className={style.leftContainer}>
        <div 
          className={style.icon} 
          onClick={handleLeftIconClick}
          title="Insertar foto"
        >
          <i className="ffas fa-user-circle"></i>
        </div>
      </div>
      
      <div className={style.rightContainer}>
        <div 
          className={style.icon} 
          onClick={handleRightIconClick}
          title="Acción adicional"
        >
          <i className="fas fa-bell"></i>
        </div>
      </div>
    </nav>
  );
};