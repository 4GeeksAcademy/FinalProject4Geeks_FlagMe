import React, { useEffect } from "react"

export const Resetpassword = () => {
    //logica 

    //visual
    return (
        <div>
            <h1>Reset Password</h1>
                <label>
                 Nueva contraseña:
                     <input
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     />
                </label>

                <label>
                 Confirmar contraseña:
                     <input
                     value={confirmpassword}
                     onChange={e => setConfirmPassword(e.target.value)}
                 />
                </label>
            
                 <button type="submit">
                 Reset
                 </button>

        </div>
    );
}; 