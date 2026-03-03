import React, { useState } from "react"
import styles from "./ForgotPassword.module.css"

export const ForgotPassword = () => {
    const [email, setEmail] = useState("")

    async function handleClick() {

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${backendUrl}/api/user/forgot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        console.log("email")
    }

    return (
        <div className={styles.forgotContainer}>
            <div className={styles.forgotBox}>
                <h1>Recuperar contraseña</h1>
                <label>
                    Escribe tu correo
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
                <button onClick={() => handleClick()} className={styles.button} type="submit">
                    Enviar
                </button>
            </div>
        </div>
    )
}