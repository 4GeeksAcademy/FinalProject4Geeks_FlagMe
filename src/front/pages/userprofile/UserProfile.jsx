import style from "./UserProfile.module.css";
import { FaArrowLeft, FaUserEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function UserProfile() {

  const navigate = useNavigate();

  const user = {
    name: "Pepe",
    email: "pepe@email.com",
    bio: "Hola soy Pepe",
    is_active: true,
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={style.container}>

      {/* HEADER */}
      <div className={style.header}>

        <div 
          className={style.backButton}
          onClick={() => navigate("/")}
        >
          <FaArrowLeft color="white" />
        </div>

        <h1 className={style.title}>Mi Perfil</h1>

        <div className={style.profileInfo}>
          <img
            src="https://i.pinimg.com/736x/8e/54/16/8e5416e326c01453db7ead215c4124dd.jpg"
            className={style.avatar}
            alt="Foto de perfil"
          />

          <h2 className={style.name}>{user.name}</h2>
          <p className={style.username}>{user.email}</p>
        </div>

      </div>

      {/* INFO */}
      <div className={style.infoCard}>
        <p><b>Bio:</b> {user.bio}</p>
        <p><b>Estado:</b> {user.is_active ? "Activo" : "Inactivo"}</p>
      </div>

      {/* MENU */}
      <div className={style.menu}>

        <button className={style.box}>
          <FaUserEdit className={style.icon} />
          Actualizar cuenta
        </button>

        <button className={style.boxDelete}>
          <FaTrash className={style.icon} />
          Eliminar cuenta
        </button>

        <button 
          className={style.boxLogout}
          onClick={handleLogout}
        >
          <FaSignOutAlt className={style.icon} />
          Cerrar sesión
        </button>

      </div>

    </div>
  );
}