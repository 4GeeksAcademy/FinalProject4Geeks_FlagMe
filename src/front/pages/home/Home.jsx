import style from "./Home.module.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const Home = () => {
      const navigate = useNavigate();
      const { dispatch, store } = useGlobalReducer();
      const [currentIndex, setCurrentIndex] = useState(0);
      const [images, setImages] = useState([]);
      const [loading, setLoading] = useState(true);
      const scrollContainerRef = useRef(null);

      const [currentUser, setCurrentUser] = useState(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
      });

      // Verificar autenticación del usuario
      useEffect(() => {
            const userData = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            // Si no hay sesión activa, redirigir al login
            if (!userData || !token) {
                  navigate("/login", { replace: true });
                  return;
            }

            try {
                  const parsedUser = JSON.parse(userData);
                  setCurrentUser(parsedUser);
            } catch (error) {
                  console.error("Error al parsear datos del usuario:", error);
                  // Si hay error al parsear, limpiar datos y redirigir al login
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/login", { replace: true });
            }
      }, [navigate]);

      useEffect(() => {
            fetchUsers(currentUser?.id);
      }, [currentUser]);

      const fetchUsers = async (currentUserId) => {
            try {
                  setLoading(true);
                  const backendUrl = import.meta.env.VITE_BACKEND_URL;

                  if (!backendUrl) {
                        throw new Error('VITE_BACKEND_URL no está configurado.');
                  }

                  console.log('Current user ID:', currentUserId);

                  let url = `${backendUrl}/api/user/`;
                  if (currentUserId) {
                        url = `${backendUrl}/api/user/${currentUserId}/feed`;
                  }

                  const response = await fetch(url);

                  const data = await response.json();
                  console.log('Usuarios recibidos:', data);

                  const filteredUsers = Array.isArray(data)
                        ? data.filter(user => user.id !== currentUserId)
                        : [];

                  const formattedUsers = filteredUsers.map(user => ({
                        id: user.id,
                        name: user.name || 'Usuario',
                        age: user.age || '?',
                        image: user.profile_pic || 'https://via.placeholder.com/400x400'
                  }));

                  setImages(formattedUsers);
            } catch (error) {
                  console.error('Error fetching users:', error);
                  alert(`Error al cargar usuarios: ${error.message}`);
            } finally {
                  setLoading(false);
            }
      };



      const scrollToImage = (index) => {
            if (scrollContainerRef.current) {
                  const containerWidth = scrollContainerRef.current.clientWidth;
                  scrollContainerRef.current.scrollTo({
                        left: index * containerWidth,
                        behavior: 'smooth'
                  });
                  setCurrentIndex(index);
            }
      };

      const handleAccept = () => {
            const acceptedUser = images[currentIndex];
            console.log(`Aceptaste a ${acceptedUser?.name}`);
            dispatch({
                  type: 'add_like',
                  payload: acceptedUser
            });
            removeCurrentImage();
      };

      const handleReject = () => {
            console.log(`Rechazaste a ${images[currentIndex]?.name}`);
            removeCurrentImage();
      };

      const removeCurrentImage = () => {
            if (images.length > 0) {
                  const newImages = images.filter((_, index) => index !== currentIndex);
                  setImages(newImages);

                  if (currentIndex >= newImages.length && newImages.length > 0) {
                        setCurrentIndex(newImages.length - 1);
                        setTimeout(() => {
                              scrollToImage(newImages.length - 1);
                        }, 50);
                  }
            }
      };

      const handleScroll = (e) => {
            const container = scrollContainerRef.current;
            if (container) {
                  const index = Math.round(container.scrollLeft / container.clientWidth);
                  setCurrentIndex(index);
            }
      };

      useEffect(() => {
            const container = scrollContainerRef.current;
            if (container) {
                  container.addEventListener('scroll', handleScroll);
                  return () => container.removeEventListener('scroll', handleScroll);
            }
      }, []);

      if (loading) {
            return (
                  <div className={style.searchContainer}>
                        <h1>Buscador</h1>
                        <div className={style.emptyState}>
                              <h2>Cargando usuarios...</h2>
                        </div>
                  </div>
            );
      }

      if (images.length === 0) {
            return (
                  <div className={style.searchContainer}>
                        <h1>Buscador</h1>
                        <div className={style.emptyState}>
                              <h2>¡No hay más perfiles!</h2>
                              <p>Vuelve más tarde para descubrir nuevas personas.</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className={style.searchContainer}>
                  <h1>Buscador</h1>

                  <div className={style.scrollContainer}>
                        <div
                              ref={scrollContainerRef}
                              className={style.imageWrapper}
                        >
                              {images.map((item, index) => (
                                    <div
                                          key={item.id}
                                          className={style.imageCard}
                                          style={{ backgroundImage: `url(${item.image})` }}
                                    >
                                          <div className={style.imageCardContent}>
                                                <div className={style.imageName}>{item.name}</div>
                                                <div className={style.imageAge}>{item.age} años</div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>

                  <div className={style.actionsContainer}>
                        <button
                              className={`${style.actionButton} ${style.rejectButton}`}
                              onClick={handleReject}
                              aria-label="Rechazar"
                        >
                              ✕
                        </button>

                        <button
                              className={`${style.actionButton} ${style.acceptButton}`}
                              onClick={handleAccept}
                              aria-label="Aceptar"
                        >
                              ✓
                        </button>
                  </div>
            </div>
      );
};