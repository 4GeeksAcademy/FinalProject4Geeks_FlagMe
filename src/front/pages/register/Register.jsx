import style from "./Register.module.css";
import { useState } from "react"

export function Register() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function createUser(e) {
        try {
            e.preventDefault()
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            let body = {
                "username": username,
                "email": email,
                "password": password, 
            }

            let result = await fetch(backendUrl + "/api/register", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={"register_page"}>
            <form className="form_register">
                <h2>Regístrate</h2>
                <div className="form-group">
                    <label htmlFor="exampleInputText">Nombre de usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputText"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <small id="emailHelp" class="form-text text-muted">Nunca compartiremos tus datos.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Contraseña</label>
                    <input type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <button className="btn btn-primary" onClick={(e)=> createUser(e)}>Submit</button>
            </form>
        </div>
    )
}