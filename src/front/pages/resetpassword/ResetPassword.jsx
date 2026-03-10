import React, { useState } from "react";
import styles from "./ResetPassword.module.css"; // Importación del módulo

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${backendUrl}/api/user/reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                password: password,
            }),
        });
        const data = await response.json();

        console.log(data);
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
