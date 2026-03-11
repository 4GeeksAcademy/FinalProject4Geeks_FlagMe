import style from "./Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePic, setProfilePic] = useState(null);

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
      document.body.style.overflow = ''; // ✅ limpia al salir
    };
  }, []);

  const hiddenRoutes = ["/userprofile", "/chat", "/login", "/register"];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));
  if (shouldHide) return null;

  const handleLeftIconClick = () => navigate("/userprofile");

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };


  return (
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
        <div className={style.icon} onClick={handleLogout} title="Cerrar sesión">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
      </div>
    </nav>
  );
};