import style from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("login");
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

            await fetch(backendUrl + "/api/login", {
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
        <div className={style.login_page}>
            <form className={style.form_login} onSubmit={createUser}>
                <div className={style.tabs}>
                    <span
                        className={`${style.tab} ${activeTab === "login" ? style.active : ""
                            }`}
                        onClick={() => setActiveTab("login")}
                    >
                        Inicia Sesión
                    </span>

                    <span
                        className={style.tab}
                        onClick={() => navigate("/register")}
                    >
                        Regístrate
                    </span>
                </div>

                <h2 className={style.title}>Bienvenido</h2>

                <input
                    type="text"
                    className={style.input}
                    placeholder="Usuario o Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className={style.input}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className={style.btn} type="submit">
                    Inicia Sesión
                </button>
            </form>
        </div>
    );
}