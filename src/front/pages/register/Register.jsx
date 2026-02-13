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

      <img
        src="https://i.pinimg.com/736x/4b/a6/fa/4ba6fae88f5a593e7b0bd8c1604de317.jpg"
        className={style.avatar}
        alt="Foto de perfil"
      />

      <h2 className={style.name}>{user.name}</h2>

      <div className={style.info}>
        <p><b>Email</b> {user.email}</p>
        <p><b>Bio</b> {user.bio}</p>
        <p><b>Active</b> {user.is_active ? "Yes" : "No"}</p>
      <

         <div className={style.menu}>

        <button className={style.box}>
          Personal Details
        </button>

        <button className={style.box}>
          Settings
        </button>

        <button className={style.box}>
          <Ayuda></Ayuda>
        </button>

      </div>

    </div>
  );
}
