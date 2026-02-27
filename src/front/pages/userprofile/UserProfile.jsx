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
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    bio: "",
    languages: "",
    interests: "",
    profile_pic: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

      // Cargar los datos del usuario en el formulario
      setFormData({
        name: parsedUser.name || parsedUser.user_metadata?.name || "",
        age: parsedUser.age || "",
        location: parsedUser.location || "",
        bio: parsedUser.bio || parsedUser.user_metadata?.bio || "",
        languages: parsedUser.languages || "",
        interests: parsedUser.interests || "",
        profile_pic: parsedUser.profile_pic || parsedUser.avatar_url || ""
      });

      if (parsedUser.avatar_url) {
        setPreviewUrl(parsedUser.avatar_url);
      }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const token = localStorage.getItem("token");

      // Preparar datos para enviar
      const dataToSend = {
        name: formData.name,
        age: formData.age,
        location: formData.location,
        bio: formData.bio,
        languages: formData.languages,
        interests: formData.interests,
        profile_pic: formData.profile_pic
      };

      const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el perfil");
      }

      const updatedUser = await response.json();

      // Actualizar el usuario en localStorage
      const updatedUserData = {
        ...user,
        ...updatedUser[0]
      };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);

      setUpdateMessage("¡Perfil actualizado con éxito!");
      setEditing(false);

      setTimeout(() => {
        setUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setUpdateMessage(`Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    // El borrado ahora se realiza tras confirmar en el modal
    setDeleting(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la cuenta");
      }

      // Si se elimina exitosamente, limpiar datos y redirigir
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert(`Error: ${error.message}`);
      setDeleting(false);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDeleteUser = async () => {
    await handleDeleteUser();
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
            src={user.profile_pic || user.avatar_url || "https://i.pinimg.com/736x/8e/54/16/8e5416e326c01453db7ead215c4124dd.jpg"}
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

        {/* boton perfil */}

        <div className={style.dropdown}>
          <div className={style.dropdownHeader} onClick={() => toggleSection("settings")}></div>
            <span>Profile</span>
            </div>

            // El contenido del perfil está por ser aclarado.

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

              {openSection === "help" && (
                <div className={style.dropdownContent}>  
                  <p><b>FAQ</b> +1 809 555 5555</p>
                  <p><b>Terminos y condiciones</b> ayuda@flagme.com</p>
               </div>
              )}
         </div>


        <button
          className={style.box}
          onClick={() => setEditing(!editing)}
        >
          <FaUserEdit className={style.icon} />
          Actualizar cuenta
        </button>

        <button
          className={style.boxDelete}
          onClick={() => setShowDeleteModal(true)}
          disabled={deleting}
        >
          <FaTrash className={style.icon} />
          {deleting ? "Eliminando..." : "Eliminar cuenta"}
        </button>

        <button
          className={style.boxLogout}
          onClick={handleLogout}
        >
          <FaSignOutAlt className={style.icon} />
          Cerrar sesión
        </button>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className={style.confirmOverlay}>
          <div className={style.confirmBox}>
            <h3>Eliminar cuenta</h3>
            <p>⚠️ Esta acción es irreversible. ¿Deseas eliminar tu cuenta?</p>
            <div className={style.confirmActions}>
              <button
                className={style.cancelButton}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className={style.dangerButton}
                onClick={confirmDeleteUser}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FORM */}
      {editing && (
        <div className={style.editFormOverlay}>
          <div className={style.editFormContainer}>
            <div className={style.editFormHeader}>
              <h2>Editar Perfil</h2>
              <button
                className={style.closeButton}
                onClick={() => setEditing(false)}
              >
                ✕
              </button>
            </div>

            {updateMessage && (
              <div className={`${style.message} ${updateMessage.startsWith("Error") ? style.error : style.success}`}>
                {updateMessage}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className={style.editForm}>
              <div className={style.formGroup}>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="age">Edad</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Tu edad"
                  min="18"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="location">Ubicación</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Tu ubicación"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre ti"
                  rows="4"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="languages">Idiomas</label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="Ej: Español, Inglés, Francés"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="interests">Intereses</label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="Ej: Viajes, Música, Deportes"
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="profile_pic">Foto de Perfil (URL)</label>
                <input
                  type="text"
                  id="profile_pic"
                  name="profile_pic"
                  value={formData.profile_pic}
                  onChange={handleInputChange}
                  placeholder="URL de tu foto de perfil"
                />
              </div>

              {previewUrl && (
                <div className={style.photoPreview}>
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}

              <div className={style.formActions}>
                <button
                  type="submit"
                  className={style.submitButton}
                  disabled={updating}
                >
                  {updating ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  className={style.cancelButton}
                  onClick={() => setEditing(false)}
                  disabled={updating}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}