import style from "./UserProfile.module.css";

export function UserProfile() {


  const user = {
    name: "Pepe",
    email: "pepe@email.com",
    bio: "Hola soy Pepe",
    is_active: true,
  };

return (
    <div className={style.page}>

      {/* FOTO */}
      <img
        src= "https://i.pinimg.com/736x/8e/54/16/8e5416e326c01453db7ead215c4124dd.jpg"
        className={style.avatar}
        alt="Foto de perfil"
      />



      {/* NOMBRE */}
      <h2 className= {style.name}>{user.name}</h2>


      {/* DATOS */}
      <div className={style.info}>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Bio:</b> {user.bio}</p>
        <p><b>Active:</b> {user.is_active ? "Yes" : "No"}</p>
      </div>

      {/* CAJITAS */}
      <div className={style.menu}>
        <button className={style.box}>
          Personal Details 
        </button>
        <button className={style.box}>
          Settings
        </button>
        <button className={style.box}>
          Help
        </button>
      </div>

      {/* BOTONES */}
        <button className={style.box}>
          Eliminar cuenta
        </button>

        <button className={style.box}>
          Actualizar cuenta
        </button>

    </div>
  )
}