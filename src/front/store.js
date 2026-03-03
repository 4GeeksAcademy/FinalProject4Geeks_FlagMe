export const initialStore = () => {
  const savedMessages = localStorage.getItem("chatMessages");
  const savedChats = localStorage.getItem("chats");

  return {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ],
    likes: [],
    chats: savedChats ? JSON.parse(savedChats) : [],
    chatMessages: savedMessages ? JSON.parse(savedMessages) : {},
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "add_like":
      return { ...store, likes: [...store.likes, action.payload] };

    case "remove_like":
      return {
        ...store,
        likes: store.likes.filter((like) => like.id !== action.payload),
      };

    case "add_chat": {
      const updatedChats = [...store.chats, action.payload];
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return { ...store, chats: updatedChats };
    }

    case "remove_chat": {
      const updatedChats = store.chats.filter(chat => String(chat.id) !== String(action.payload));
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return { ...store, chats: updatedChats };
    }

    case "send_message": {
      const { chatId, message } = action.payload;
      const updatedMessages = {
        ...store.chatMessages,
        [chatId]: [
          ...(store.chatMessages[chatId] || []),
          message,
        ],
      };
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return { ...store, chatMessages: updatedMessages };
    }

    default:
      throw Error("Unknown action.");
  }
}