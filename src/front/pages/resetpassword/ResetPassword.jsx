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
        <div className={styles.resetContainer}>
            <div className={styles.resetBox}>
                <h1 className={styles.resetBox}>Reset Password</h1>
                
                <form onSubmit={handleSubmit}>
                    <label className={styles.resetBox}>
                        Nueva contraseña:
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label className={styles.resetBox}>
                        Confirmar contraseña:
                        <input
                            type="password"
                            className={styles.resetBox}
                            value={confirmpassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                
                    <button type="submit" className={styles.resetButton}>
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};
