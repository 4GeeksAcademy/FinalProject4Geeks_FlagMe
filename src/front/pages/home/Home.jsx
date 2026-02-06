import style from "./Home.module.css";
import { useState, useEffect, useRef } from "react";

export const Home = () => {
  const [users, setUsers] = useState([]);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Datos de ejemplo
  const sampleUsers = [
    {
      id: 1,
      name: "Alex Martínez",
      location: "Madrid, España",
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      location: "Barcelona",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 3,
      name: "María González",
      location: "Ciudad de México",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: false
    },
    {
      id: 4,
      name: "David López",
      location: "Buenos Aires",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 5,
      name: "Laura Sánchez",
      location: "Lima, Perú",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 6,
      name: "Javier Pérez",
      location: "Santiago de Chile",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: false
    },
    {
      id: 7,
      name: "Ana Ruiz",
      location: "Bogotá, Colombia",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 8,
      name: "Pedro Gómez",
      location: "Medellín",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 9,
      name: "Sofía Hernández",
      location: "Montevideo",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: false
    },
    {
      id: 10,
      name: "Miguel Torres",
      location: "Caracas",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 11,
      name: "Elena Castro",
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: true
    },
    {
      id: 12,
      name: "Ricardo Vargas",
      location: "San José, Costa Rica",
      image: "https://images.unsplash.com/photo-1506919258185-607c73101d8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      online: false
    }
  ];
  
  useEffect(() => {
    setUsers(sampleUsers);
    
    // Forzar recálculo del layout en cambios de tamaño
    const handleResize = () => {
      if (containerRef.current) {
        // Trigger reflow para recalcular dimensiones
        containerRef.current.style.display = 'none';
        containerRef.current.offsetHeight;
        containerRef.current.style.display = '';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleUserClick = (userId) => {
    const user = users.find(u => u.id === userId);
    console.log(`Usuario clickeado: ${user?.name} - ${user?.location}`);
  };
  
  // Renderizado MÓVIL - Una sola columna vertical
  if (isMobile) {
    return (
      <div className={style.homeContainer} ref={containerRef}>
        <div className={style.singleColumnWrapper}>
          <div className={style.singleColumn}>
            {users.map(user => (
              <div 
                key={user.id} 
                className={style.userCard}
                onClick={() => handleUserClick(user.id)}
              >
                <div className={user.online ? style.onlineIndicator : style.offlineIndicator}></div>
                <div className={style.imageOverlay}></div>
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className={style.userImage}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = '#f0f0f0';
                  }}
                />
                <div className={style.infoOverlay}>
                  <h3 className={style.userName}>{user.name}</h3>
                  <div className={style.userLocation}>
                    <i className={`fas fa-map-marker-alt ${style.locationIcon}`}></i>
                    {user.location}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizado WEB - Grid de 2 columnas
  return (
    <div className={style.homeContainer} ref={containerRef}>
      <div className={style.gridContainer}>
        <div className={style.gridTwoColumns}>
          {users.map(user => (
            <div 
              key={user.id} 
              className={style.gridUserCard}
              onClick={() => handleUserClick(user.id)}
            >
              <div className={user.online ? style.onlineIndicator : style.offlineIndicator}></div>
              <div className={style.imageOverlay}></div>
              <img 
                src={user.image} 
                alt={user.name} 
                className={style.userImage}
                loading="lazy"
                onError={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#f0f0f0';
                }}
              />
              <div className={style.infoOverlay}>
                <h3 className={style.userName}>{user.name}</h3>
                <div className={style.userLocation}>
                  <i className={`fas fa-map-marker-alt ${style.locationIcon}`}></i>
                  {user.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};