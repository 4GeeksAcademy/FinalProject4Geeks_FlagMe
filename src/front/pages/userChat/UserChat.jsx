import { useState } from "react"
 <link rel="stylesheet" type="text/css" href="UserChat.module.css"></link>
export function UserChat() {

    return (
       <div id="chat-container">
    <div id="upper-name">
        <button id="back-button">Atrás</button>
        <h1>Nombre</h1>
    </div>
    <div class="chat-messages">
        <div class="other-message"></div>
            <div class="upper-name-message">
                <div class="avatar-other"> </div>
                <div class="name-other"></div>
                </div>
            <div class="message-space-other"></div>

         <div class="user-message"></div>
            <div class="upper-name-message">
                <div class="avatar-user"> </div>
                <div class="name-user"></div>
                </div>
            <div class="message-space-user"></div>
    </div>
    <div id="chat-input-container">
        <input type="text" id="chat-input" placeholder="Escribe tu mensaje..."/>
        <button id="send-button">Enviar</button>
    </div>
</div>
    )
}