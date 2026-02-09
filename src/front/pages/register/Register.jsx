import style from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function createUser(e) {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      let body = {
        username,
        email,
        password,
      };

      await fetch(backendUrl + "/api/register", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={style.register_page}>
      <form className={style.form_register} onSubmit={createUser}>
        <div className={style.tabs}>
          <span
            className={style.tab}
            onClick={() => navigate("/login")}
          >
            Inicia Sesión
          </span>

          <span className={`${style.tab} ${style.active}`}>
            Regístrate
          </span>
        </div>

        <h2 className={style.title}>Bienvenido</h2>

        <input
          type="text"
          className={style.input}
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          className={style.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className={style.input}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={style.btn} type="submit">
          Regístrate
        </button>
      </form>
    </div>
  );
}
