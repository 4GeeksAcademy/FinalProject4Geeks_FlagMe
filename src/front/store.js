export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    likes: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    case 'add_like':
      return {
        ...store,
        likes: [...store.likes, action.payload]
      };
    case 'remove_like':
      return {
        ...store,
        likes: store.likes.filter(like => like.id !== action.payload)
      };
    default:
      throw Error('Unknown action.');
  }    
}
