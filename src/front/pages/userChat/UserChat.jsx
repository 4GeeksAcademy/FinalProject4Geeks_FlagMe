import { useState } from "react"
 <link rel="stylesheet" type="text/css" href="UserChat.module.css"></link>
export function UserChat() {

    return (
       <div className="chat-container">
    <div className="upper-name">
        <button className="back-button">Atrás</button>
        <h1>Nombre</h1>
    </div>
    <div className="chat-messages">
        <div className="other-message"></div>
            <div className="upper-name-message">
                <div className="avatar-other"> </div>
                <div className="name-other"></div>
                </div>
            <div className="message-space-other"></div>

         <div className="user-message"></div>
            <div className="upper-name-message">
                <div className="avatar-user"> </div>
                <div className="name-user"></div>
                </div>
            <div className="message-space-user"></div>
    </div>
    <div className="chat-input-container">
        <input type="text" id="chat-input" placeholder="Escribe tu mensaje..."/>
        <button className="send-button">Enviar</button>
    </div>
</div>
    )
}