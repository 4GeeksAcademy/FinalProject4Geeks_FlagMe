import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./Configuration.module.css";

export const Configuration = () => {
  const navigate = useNavigate();
  
  
  // Estados para las configuraciones
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sounds: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    dataSharing: false,
    activityStatus: true,
  });
  const [language, setLanguage] = useState("es");
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  
  // Manejar cambio de tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // En una aplicación real, aquí aplicarías el tema
    document.body.className = newTheme;
  };
  
  // Manejar cambio de notificaciones
  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };
  
  // Manejar cambio de privacidad
  const handlePrivacyChange = (setting, value) => {
    setPrivacy({
      ...privacy,
      [setting]: value,
    });
  };
  
  // Guardar configuraciones (simulado)
  const handleSave = () => {
    alert("Configuraciones guardadas exitosamente!");
    // En una aplicación real, aquí enviarías los datos al servidor
  };
  
  // Restablecer configuraciones
  const handleReset = () => {
    setTheme("light");
    setNotifications({
      email: true,
      push: true,
      sounds: false,
    });
    setPrivacy({
      profileVisibility: "public",
      dataSharing: false,
      activityStatus: true,
    });
    setLanguage("es");
    setAutoSave(true);
    setFontSize(16);
    alert("Configuraciones restablecidas a valores predeterminados");
  };
  
  return (
    <div className={style.configurationContainer}>
      {/* Encabezado */}
      <header className={style.header}>
        <button 
          className={style.backButton}
          onClick={() => navigate(-1)}
          aria-label="Volver atrás"
        >
          &larr; Volver
        </button>
        <h1 className={style.title}>Configuración de la Aplicación</h1>
        <p className={style.subtitle}>Personaliza tu experiencia según tus preferencias</p>
      </header>
      
      <div className={style.contentWrapper}>
        {/* Panel de navegación lateral */}
        <nav className={style.sidebar}>
          <ul className={style.navList}>
            <li className={style.navItem}><a href="#general">General</a></li>
            <li className={style.navItem}><a href="#notifications">Notificaciones</a></li>
            <li className={style.navItem}><a href="#privacy">Privacidad</a></li>
            <li className={style.navItem}><a href="#appearance">Apariencia</a></li>
            <li className={style.navItem}><a href="#account">Cuenta</a></li>
          </ul>
          
          <div className={style.sidebarFooter}>
            <p className={style.appVersion}>Versión 0.0.1</p>
          </div>
        </nav>
        
        {/* Contenido principal */}
        <main className={style.mainContent}>
          {/* Sección General */}
          <section id="general" className={style.section}>
            <h2 className={style.sectionTitle}>Configuración General</h2>
            
            <div className={style.settingGroup}>
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Idioma</h3>
                  <p className={style.settingDescription}>Selecciona el idioma de la interfaz</p>
                </div>
                <div className={style.settingControl}>
                  <select 
                    className={style.select}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Guardado automático</h3>
                  <p className={style.settingDescription}>Guarda automáticamente los cambios en tu trabajo</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={autoSave}
                      onChange={() => setAutoSave(!autoSave)}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Tamaño de fuente</h3>
                  <p className={style.settingDescription}>Ajusta el tamaño del texto en la aplicación</p>
                </div>
                <div className={style.settingControl}>
                  <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className={style.slider}
                  />
                  <span className={style.sliderValue}>{fontSize}px</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Sección Notificaciones */}
          <section id="notifications" className={style.section}>
            <h2 className={style.sectionTitle}>Configuración de Notificaciones</h2>
            
            <div className={style.settingGroup}>
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Notificaciones por correo</h3>
                  <p className={style.settingDescription}>Recibe actualizaciones importantes por email</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange("email")}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Notificaciones push</h3>
                  <p className={style.settingDescription}>Recibe notificaciones en tiempo real</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => handleNotificationChange("push")}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Sonidos de notificación</h3>
                  <p className={style.settingDescription}>Reproduce sonidos al recibir notificaciones</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={notifications.sounds}
                      onChange={() => handleNotificationChange("sounds")}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          </section>
          
          {/* Sección Privacidad */}
          <section id="privacy" className={style.section}>
            <h2 className={style.sectionTitle}>Privacidad y Seguridad</h2>
            
            <div className={style.settingGroup}>
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Visibilidad del perfil</h3>
                  <p className={style.settingDescription}>Controla quién puede ver tu perfil</p>
                </div>
                <div className={style.settingControl}>
                  <select 
                    className={style.select}
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="public">Público</option>
                    <option value="friends">Solo amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Compartir datos de uso</h3>
                  <p className={style.settingDescription}>Permite compartir datos anónimos para mejorar la aplicación</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={privacy.dataSharing}
                      onChange={() => handlePrivacyChange("dataSharing", !privacy.dataSharing)}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Estado de actividad</h3>
                  <p className={style.settingDescription}>Muestra cuándo estás en línea</p>
                </div>
                <div className={style.settingControl}>
                  <label className={style.toggleSwitch}>
                    <input 
                      type="checkbox"
                      checked={privacy.activityStatus}
                      onChange={() => handlePrivacyChange("activityStatus", !privacy.activityStatus)}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          </section>
          
          {/* Sección Apariencia */}
          <section id="appearance" className={style.section}>
            <h2 className={style.sectionTitle}>Apariencia</h2>
            
            <div className={style.settingGroup}>
              <div className={style.settingItem}>
                <div className={style.settingInfo}>
                  <h3 className={style.settingName}>Tema de la aplicación</h3>
                  <p className={style.settingDescription}>Elige entre tema claro u oscuro</p>
                </div>
                <div className={style.settingControl}>
                  <div className={style.themeOptions}>
                    <button 
                      className={`${style.themeOption} ${theme === "light" ? style.activeTheme : ""}`}
                      onClick={() => handleThemeChange("light")}
                      aria-label="Tema claro"
                    >
                      <div className={style.themePreviewLight}></div>
                      <span>Claro</span>
                    </button>
                    <button 
                      className={`${style.themeOption} ${theme === "dark" ? style.activeTheme : ""}`}
                      onClick={() => handleThemeChange("dark")}
                      aria-label="Tema oscuro"
                    >
                      <div className={style.themePreviewDark}></div>
                      <span>Oscuro</span>
                    </button>
                    <button 
                      className={`${style.themeOption} ${theme === "auto" ? style.activeTheme : ""}`}
                      onClick={() => handleThemeChange("auto")}
                      aria-label="Tema automático"
                    >
                      <div className={style.themePreviewAuto}></div>
                      <span>Automático</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Botones de acción */}
          <div className={style.actionButtons}>
            <button 
              className={style.secondaryButton}
              onClick={handleReset}
            >
              Restablecer valores
            </button>
            <button 
              className={style.primaryButton}
              onClick={handleSave}
            >
              Guardar cambios
            </button>
          </div>
          
          {/* Mensaje */}
          <div className={style.footerNote}>
            <p>La configuración se aplicará a todos tus dispositivos conectados a esta cuenta.</p>
            <p>Si tienes problemas con la configuración, contáctanos en <a href="mailto:soporte@app.com">soporte@app.com</a></p>
          </div>
        </main>
      </div>
    </div>
  );
};