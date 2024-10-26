'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserNavBar from '@/components/UserNavBar';

import styles from '../../styles/user-workout/page.module.css';

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('/api/user-data', {
          method: 'GET',
          credentials: 'include'
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Falha ao buscar dados do usuário');
        };

        const userData = await userResponse.json();
        setUserData(userData);

        if (userData._id) {
          const workoutsResponse = await fetch(`/api/user-workouts?userId=${userData._id}`);
          
          if (!workoutsResponse.ok) {
            throw new Error('Falha ao buscar treinos');
          };
          
          const workoutsData = await workoutsResponse.json();
          setWorkouts(workoutsData);
        };

      } catch (err) {
        console.error(`Erro: ${err.message}`);
      };
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'GET',
      });
      router.push('/');

    } catch (error) {
      console.error(`Erro ao fazer logout:`, error);
    }
  };

  const toggleCard = (workoutId) => {
    setFlippedCards(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  if (!userData) return <div className={styles.loading}>Carregando...</div>;

  return (
    <>
    <div><UserNavBar /></div>
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo, {userData.name || 'Aluno'}</h1>
        <p>Seus treinos personalizados</p>
        <div className={styles.userInfo}>
          <p>Email: {userData.email}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.workoutGrid}>
        {workouts.length === 0 ? (
          <p className={styles.noWorkouts}>Nenhum treino encontrado.</p>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout._id}
              className={`${styles.workoutCard} ${flippedCards[workout._id] ? styles.flipped : ''}`}
              onClick={() => toggleCard(workout._id)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <span className={styles.muscle}>{workout.muscle}</span>
                  <h2>{workout.description}</h2>
                  <p className={styles.date}>{workout.date || 'Data não definida'}</p>
                  <div className={styles.tags}>
                   {/*  <span className={styles.level}>{workout.level}</span> */}
                   {/*  <span className={styles.category}>{workout.category}</span> */}
                    <span className={styles.category}>Treino: {workout.workoutStatus}</span>
                  </div>
                </div>
                <div className={styles.cardBack}>
                  <ul className={styles.exerciseList}>
                    {workout.exercises && workout.exercises.map((exercise, index) => (
                      <li key={index}>{index + 1} - {exercise.replace(/^\d+\./, '')}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
    </>
  );
};


export default Page;  


