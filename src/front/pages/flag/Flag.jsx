import style from "./Flag.module.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const Flag = () => {
  const { store } = useGlobalReducer();

  const handleUserClick = (user) => {
    console.log("Usuario:", user.name);
  };

  return (
    <div className={style.homeContainer}>
      {store.likes && store.likes.length > 0 ? (
        <div className={style.grid}>
          {store.likes.map(user => (
            <div
              key={user.id}
              className={style.card}
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.image}
                alt={user.name}
                className={style.image}
              />

              <div className={style.gradient} />

              <div className={style.info}>
                <h3 className={style.name}>
                  {user.name}, {user.age}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.emptyState}>
          <h2>Sin favoritos aún</h2>
          <p>Ve al buscador y acepta perfiles para verlos aquí</p>
        </div>
      )}
    </div>
  );
};