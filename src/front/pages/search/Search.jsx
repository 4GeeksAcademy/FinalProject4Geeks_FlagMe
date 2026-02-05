import style from "./Search.module.css";
import { useState, useEffect, useRef } from "react";

export const Search = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Datos de ejemplo con imágenes
  const [images, setImages] = useState([
    {
      id: 1,
      name: "Alex",
      age: 28,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
    },
    {
      id: 2,
      name: "Samantha",
      age: 25,
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d1?w=400&h=500&fit=crop"
    },
    {
      id: 3,
      name: "Michael",
      age: 30,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop"
    },
    {
      id: 4,
      name: "Emma",
      age: 26,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"
    }
  ]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const index = Math.round(scrollLeft / containerWidth);
      setCurrentIndex(index);
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
    console.log(`Aceptaste a ${images[currentIndex]?.name}`);
    // Lógica para aceptar/match
    removeCurrentImage();
  };

  const handleReject = () => {
    console.log(`Rechazaste a ${images[currentIndex]?.name}`);
    // Lógica para rechazar
    removeCurrentImage();
  };

  const removeCurrentImage = () => {
    if (images.length > 0) {
      const newImages = images.filter((_, index) => index !== currentIndex);
      setImages(newImages);
      
      // Si estamos en la última imagen y la eliminamos, retrocedemos al índice anterior
      if (currentIndex >= newImages.length && newImages.length > 0) {
        setCurrentIndex(newImages.length - 1);
        setTimeout(() => {
          scrollToImage(newImages.length - 1);
        }, 50);
      }
    }
  };

  // Efecto para añadir event listener al scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

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


      {/* Botones de acción */}
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