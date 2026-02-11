import style from "./Home.module.css";
import { useState, useEffect } from "react";


export const Home = () => {
  const [users, setUsers] = useState([]);

  const sampleUsers = [
    {
      id: 1,
      name: "Naomí",
      age: 21,
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d9",
      online: true
    },
    {
      id: 2,
      name: "Martin",
      age: 23,
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      online: true
    },
    {
      id: 3,
      name: "Samara",
      age: 22,
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
      online: true
    },
    {
      id: 4,
      name: "Josefina",
      age: 21,
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      online: true
    }
  ];

  useEffect(() => {
    setUsers(sampleUsers);
  }, []);

  const handleUserClick = (user) => {
    console.log("Usuario:", user.name);
  };

  return (
    <div className={style.homeContainer}>
      <div className={style.grid}>
        {users.map(user => (
          <div
            key={user.id}
            className={style.card}
            onClick={() => handleUserClick(user)}
          >
            {user.online && <span className={style.onlineDot} />}

            <img
              src={user.image}
              alt={user.name}
              className={style.image}
            />

            <div className={style.gradient} />

            <div className={style.info}>
              <span className={style.distance}>
              </span>

              <h3 className={style.name}>
                {user.name}, {user.age}
              </h3>

              <p className={style.location}>
                {user.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
