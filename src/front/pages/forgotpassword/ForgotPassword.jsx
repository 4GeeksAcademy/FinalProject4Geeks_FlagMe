import React, { useState } from "react"
import styles from "./ForgotPassword.module.css"

export const ForgotPassword = () => {
    const [email, setEmail] = useState("")

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://example.com/update-password',
})
    const { data, error } = await supabase.auth.updateUser({
  password: new_password
})c

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
                <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {message && <p>{message}</p>}
            </div>
        </div>
    )
}