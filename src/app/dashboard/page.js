'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserNavBar from '@/components/UserNavBar';

import styles from '../../styles/user-workout/page.module.css';

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [flippedCards, setFlippedCards] = useState({}); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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

  const handleStatusUpdateClick = (e, workout) => {
    e.stopPropagation();
    setSelectedWorkout(workout);
    setShowConfirmModal(true);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
  };

  const updateWorkoutStatus = async (workoutId, newStatus) => {
    try {
      const response = await fetch('/api/user-update-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workoutId, status: newStatus })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar o status do treino');
      }
  
      setWorkouts(prevWorkouts =>
        prevWorkouts.map(workout =>
          workout._id === selectedWorkout._id ? { ...workout, workoutStatus: 'Pago' } : workout
        )
      );

      setShowConfirmModal(false);
      setShowSuccessAlert(true);
      
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    };
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

        {showSuccessAlert && (
          <div className={styles.successAlert}>
            <p>Treino Pago!</p>
          </div>
        )}

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

                        <span className={styles.category}>
                          Treino:
                          {workout.workoutStatus === 'Pendente' ? (
                            <button
                              onClick={(e) => handleStatusUpdateClick(e, workout)}
                              className={styles.statusButton}
                            >
                              {workout.workoutStatus}
                            </button>
                          ) : (
                            <span className={styles.paidStatus}>Pago</span>
                          )}
                        </span>

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

        {showConfirmModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Confirmar Conclusão do Treino</h2>
              <p>Você já executou este treino e deseja marcá-lo como concluído?</p>
              <div className={styles.modalButtons}>
                <button onClick={closeModal} className={styles.modalCancel}>
                  Cancelar
                </button>
                <button onClick={() => updateWorkoutStatus(selectedWorkout._id, 'Pago')} className={styles.modalConfirm}>    
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};


export default Page;


