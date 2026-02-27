import { useState, useEffect } from "react";
import style from "./UserProfile.module.css";
import { FaArrowLeft, FaUserEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // Verificar si hay sesión activa
    if (!userData || !token) {
      // Si no hay usuario en localStorage, redirigir al login
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      // Si hay error, redirigir al login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return <div className={style.loading}>Cargando perfil...</div>;
  }
  // Si no hay usuario, no renderizar nada (la redirección ya ocurrió en useEffect)
  if (!user) {
    return null;
  }
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
            src={user.avatar_url || "https://i.pinimg.com/736x/8e/54/16/8e5416e326c01453db7ead215c4124dd.jpg"}
            className={style.avatar}
            alt="Foto de perfil"
          />

          <h2 className={style.name}>{user.name || user.user_metadata?.name || "Usuario"}</h2>
          <p className={style.username}>{user.email}</p>
        </div>

      </div>

      {/* INFO */}
      <div className={style.infoCard}>
        <p><b>Bio:</b> {user.bio || user.user_metadata?.bio || "Sin biografía"}</p>
        <p><b>Estado:</b> {user.is_active ? "Activo" : "Inactivo"}</p>
      </div>

      {/* MENU */}
      <div className={style.menu}>

        {/* boton ayuda */}

        <div className={style.dropdown}>
          <div
            className={style.dropdownHeader}
            onClick={() => toggleSection("help")}
          >
            <span>Help</span>
          </div>

          {openSection === "help" && (
            <div className={style.dropdownContent}>
              <p><b>Teléfono:</b> +1 809 555 5555</p>
              <p><b>Email:</b> ayuda@flagme.com</p>
            </div>
          )}
        </div>



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