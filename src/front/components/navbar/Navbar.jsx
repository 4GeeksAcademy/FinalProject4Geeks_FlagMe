import style from "./Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePic, setProfilePic] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const hiddenRoutes = ["/userprofile", "/chat", "/login", "/register"];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setProfilePic(parsedUser.profile_pic || parsedUser.avatar_url || null);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (shouldHide) return null; // ✅ después de todos los hooks

  const handleLeftIconClick = () => navigate("/userprofile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className={style.navbar}>
        <div className={style.leftContainer}>
          <div
            className={style.icon}
            onClick={handleLeftIconClick}
            title="Ver perfil"
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Perfil"
                style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
              />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>
        </div>

        <div className={style.rightContainer}>
          <div className={style.icon} onClick={() => setShowLogoutModal(true)} title="Cerrar sesión">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
        </div>
      </nav>

      {/* Modal de cierre de sesión */}
      {showLogoutModal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h3>¿Cerrar sesión?</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className={style.modalButtons}>
              <button className={style.cancelButton} onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className={style.logoutButton} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};