import style from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { MapPin, Speech, Star } from "lucide-react";
import { MatchModal } from "../matchModal/MatchModal"

export const Home = () => {
    const navigate = useNavigate();
    const { dispatch, store } = useGlobalReducer();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchedUser, setMatchedUser] = useState(null); //

    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    });

    const loadMatches = async (userId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const url = `${backendUrl}/api/user/matches/${userId}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            console.log("Matches data:", data);

            data.forEach(match => {
                const matchedUser = match.matched_user;
                const chatExists = store.chats.some(chat => String(chat.id) === String(matchedUser.id));

                if (!chatExists) {
                    dispatch({
                        type: 'add_chat',
                        payload: {
                            id: matchedUser.id,
                            name: matchedUser.name,
                            image: matchedUser.profile_pic,
                            lastMessage: '¡Es un match! Di hola 👋',
                            time: new Date(match.created_at).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error al cargar matches:', error);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userData || !token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
            loadMatches(parsedUser.id);
        } catch (error) {
            console.error("Error al parsear datos del usuario:", error);
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

            if (!backendUrl) throw new Error('VITE_BACKEND_URL no está configurado.');

            let url = `${backendUrl}/api/user/`;
            if (currentUserId) {
                url = `${backendUrl}/api/user/${currentUserId}/feed`;
            }

            const response = await fetch(url);
            const data = await response.json();

            const filteredUsers = Array.isArray(data)
                ? data.filter(user => user.id !== currentUserId)
                : [];

            const formattedUsers = filteredUsers.map(user => ({
                id: user.id,
                name: user.name || 'Usuario',
                age: user.age || '?',
                image: user.profile_pic || 'https://via.placeholder.com/400x400',
                location: user.location || null,
                languages: (() => {
                    try {
                        const parsed = JSON.parse(user.languages || '[]');
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        return user.languages ? [user.languages] : [];
                    }
                })(),
                interests: (() => {
                    try {
                        const parsed = JSON.parse(user.interests || '[]');
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        return user.interests ? [user.interests] : [];
                    }
                })(),
            }));

            setImages(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert(`Error al cargar usuarios: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ✅ handleAccept: da like y crea chat si hay match
    const handleAccept = async () => {
        const acceptedUser = images[currentIndex];

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/user/likes/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from_user_id: currentUser.id,
                    to_user_id: acceptedUser.id
                })
            });

            const data = await response.json();
            console.log("Respuesta likes:", data);
            dispatch({ type: 'add_like', payload: acceptedUser });

            if (data.message === "Match created successfully") {
                const newChat = {
                    id: acceptedUser.id,
                    name: acceptedUser.name,
                    image: acceptedUser.image,
                    lastMessage: '¡Es un match! Di hola 👋',
                    time: new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };

                dispatch({ type: 'add_chat', payload: newChat });
                setMatchedUser(acceptedUser); // ✅ modal en lugar de alert
            }

        } catch (error) {
            console.error('Error al dar like:', error);
        }

        removeCurrentImage();
    };

    const handleReject = () => {
        removeCurrentImage();
    };

    const removeCurrentImage = () => {
        if (images.length > 0) {
            const newImages = images.filter((_, index) => index !== currentIndex);
            setImages(newImages);

            if (currentIndex >= newImages.length && newImages.length > 0) {
                setCurrentIndex(newImages.length - 1);
            }
        }
    };

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

    const currentImage = images[currentIndex];

    return (
        <div className={style.searchContainer}>

            {/* ✅ Modal de match */}
            <MatchModal
                user={matchedUser}
                onClose={() => setMatchedUser(null)}
            />

            <h1>Buscador</h1>

            <div className={style.scrollContainer}>
                <div className={style.imageWrapper}>
                    <div
                        className={style.imageCard}
                        style={{ backgroundImage: `url(${currentImage.image})` }}
                    >
                        <div className={style.imageCardContent}>
                            <div className={style.imageName}>{currentImage.name}</div>
                            <div className={style.imageAge}>{currentImage.age} años</div>

                            {currentImage.location && (
                                <div className={style.imageLocation}>
                                    <MapPin size={14} /> {currentImage.location}
                                </div>
                            )}

                            {currentImage.languages?.length > 0 && (
                                <div className={style.imageTags}>
                                    <Speech size={14} /> {currentImage.languages.join(' · ')}
                                </div>
                            )}

                            {currentImage.interests?.length > 0 && (
                                <div className={style.imageTags}>
                                    <Star size={14} /> {currentImage.interests.join(' · ')}
                                </div>
                            )}
                        </div>
                    </div>
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