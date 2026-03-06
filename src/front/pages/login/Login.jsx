import style from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();


    async function handleLogin(e) {
        e.preventDefault();

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.error);
                Swal.fire({
                    icon: "error",
                    title: "Credenciales incorrectas",
                    confirmButtonText: "Intentar de nuevo",
                    confirmButtonColor: "var(--primary-color)",
                });
                return;
            }

            console.log("Login correcto:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/");

            // notify other parts of the app that a user logged in (after navigation)
            setTimeout(() => {
                try {
                    window.dispatchEvent(new Event('userLoggedIn'));
                } catch (e) {
                    // ignore if dispatch fails in some environments
                }
            }, 100);

        } catch (error) {
            console.log(error);
            Swal.fire({
                    icon: "error",
                    title: "Credenciales incorrectas",
                    confirmButtonText: "Intentar de nuevo",
                    confirmButtonColor: "var(--primary-color)",
                });
        }
    }





    return (
        <div className={style.login_page}>
            <form className={style.form_login} onSubmit={handleLogin}>
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
                    Inicia Sesión
                </button>

                <hr></hr>

                <Link to="/forgotpassword">¿Haz olvidado tu contraseña?</Link>

            </form>
        </div>
    );
}