import style from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  //const [username, setUsername] = useState(""); (Lo dejo así porque el backend solo me pide por ahora el Email y Contraseña)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function createUser(e) {
    e.preventDefault();
    
    try {
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/create_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        alert(data.error || "Error al registrarse");
        return;
      }

      console.log("Usuario creado:", data);

      navigate("/login");

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
