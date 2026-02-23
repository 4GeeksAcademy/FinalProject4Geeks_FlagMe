import React, { useEffect } from "react"

export const Forgotpassword = () => {
    //logica 

    //visual
    return (
        <div>
            <h1>Forgot</h1>
                <label>
              Escribe tu correo
                    <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </label>
            
                <button type="submit">
                Enviar
                </button>

        </div>
    );
}; 