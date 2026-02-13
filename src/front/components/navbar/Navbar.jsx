import style from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLeftIconClick = () => {
    console.log("Icono izquierdo clickeado");
    alert("Icono izquierdo: Aquí iría la lógica para insertar una foto");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmLogout) {
      navigate("/login");
    }
  };

  return (
    <nav className={style.navbar}>
      <div className={style.leftContainer}>
        <div
          className={style.icon}
          onClick={handleLeftIconClick}
          title="Insertar foto"
        >
          <i class="fa-solid fa-user"></i>
        </div>
      </div>

      <div className={style.rightContainer}>
        <div
          className={style.icon}
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
      </div>
    </nav>
  );
};
