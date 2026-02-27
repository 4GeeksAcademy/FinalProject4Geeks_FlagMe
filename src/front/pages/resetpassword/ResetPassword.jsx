import React, { useState } from "react";
import styles from "./ResetPassword.module.css"; // Importación del módulo

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para resetear
        console.log("Password changed");
    };

    return (
        <div className={styles.forgotContainer}>
            <div className={styles.forgotBox}>
                <h1 className={styles.title}>Reset Password</h1>
                
                <form onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Nueva contraseña:
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Confirmar contraseña:
                        <input
                            type="password"
                            className={styles.input}
                            value={confirmpassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                
                    <button type="submit" className={styles.button}>
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};