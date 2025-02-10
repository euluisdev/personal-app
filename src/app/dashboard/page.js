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
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
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
            router.push('/');
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
          console.log(workoutsData);
          setWorkouts(workoutsData);
        };

      } catch (err) {
        console.error(`Erro: ${err.message}`);
      };
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/user-profile');
        const data = await response.json();

        if (response.ok) {
          setProfilePhoto(data);
        } else {
          console.error(`Erro na resposta da API!`, data);
        };

      } catch (error) {
        console.error(`Erro ao buscar file:`, error)
      } finally {
        setIsLoading(false);
      };
    };
    fetchProfilePhoto();
  }, []);

  const toggleCard = (workoutId) => {
    setFlippedCards(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return now.toLocaleDateString('pt-BR', options);
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
          <h1 className={styles.titleWellCome}>
            {getGreeting()} {userData.name || 'Aluno'}!&nbsp;<br />
            
          </h1>
          <div className={styles.userInfo}>
            <p>Hoje é {getFormattedDate()}</p>
            {isLoading && <div className='loadingSpinner' />}

            {profilePhoto && (
              <img
                src={profilePhoto.photoUrl}
                alt="Foto do Perfil"
                className={styles.profileImage}
              />
            )}

          </div>
        </header>

        {showSuccessAlert && (
          <div className={styles.successAlert}>
            <p>Treino Pago! 💪</p>
          </div>
        )}

        <main className={styles.workoutGrid}>
          {workouts.length === 0 ? (
            <p className={styles.noWorkouts}>Nenhum treino encontrado ainda...</p>
          ) : (
            workouts.slice(-2).map((workout) => (

              <div
                key={workout._id}
                className={`${styles.workoutCard} ${flippedCards[workout._id] ? styles.flipped : ''}`}
                onClick={() => toggleCard(workout._id)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>
                    <div className={styles.muscle}>
                      <span>Workout Card</span>
                    </div>
                    <h2 className={styles.description}>
                      {workout.date
                        ? new Date(workout.date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                        })
                        : 'Data não definida'
                      }
                    </h2>
                    <div className={styles.tags}>

                      <span className={styles.category}>
                        {workout.workoutStatus === 'Pendente' ? (
                          <button
                            onClick={(e) => handleStatusUpdateClick(e, workout)}
                            className={styles.statusButton}
                          >
                            {workout.workoutStatus}
                          </button>
                        ) : (
                          <span className={styles.paidStatus}>Treino Pago ✓ </span>
                        )}
                      </span>

                    </div>

                    <div className={styles.date}>
                      <span>
                        Treino criado por {workout.nome || 'Professor'}
                      </span>
                      <p>
                        Personal - CREF: {workout.cref || '1234-5'}
                      </p>
                    </div>

                  </div>
                  <div className={styles.cardBack}>
                    {workout.muscleGroups?.map((muscleGroup, muscleIndex) => (
                      <div key={`group-${muscleIndex}`}>
                        <h3 className={styles.cardBackTitle}>{muscleGroup.muscle}</h3>
                        <ul className={styles.exerciseList}>
                          {muscleGroup.exercises.map((exercise, exerciseIndex) => (
                            <li key={`${muscleIndex}-${exerciseIndex}`}>
                              {exerciseIndex + 1} - {exercise.replace(/^\d+\./, '').trim()}
                              <input type="radio" name={`exercise-${muscleIndex}-${exerciseIndex}`} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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


