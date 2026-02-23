import React, { useState } from "react"
import styles from "./Forgotpassword.module.css"

export const Forgotpassword = () => {
    const [email, setEmail] = useState("")

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
                <button className={styles.button} type="submit">
                    Enviar
                </button>
            </div>
        </div>
    )
}