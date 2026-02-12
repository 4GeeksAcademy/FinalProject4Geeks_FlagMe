import { useState } from "react"

export function UserChat() {

    return (
       <div id="chat-container">
    <div id="chat-messages">
    </div>
    <div id="chat-input-container">
        <input type="text" id="chat-input" placeholder="Escribe tu mensaje..."/>
        <button id="send-button">Enviar</button>
    </div>
</div>
    )
}