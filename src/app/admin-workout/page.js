'use client';

import React, { useState, useEffect } from 'react';
import { User, Target, Search, X, Check, MinusCircle, Calendar, Dumbbell, ChevronRight, Mail, Weight, Ruler, Phone, ChevronDown } from 'lucide-react';

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-workout/page.module.css';

const WorkoutHistory = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleUserCard = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return;
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return 'IMC não calculado';
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi <= 24.9) return 'Peso normal';
    if (bmi <= 29.9) return 'Sobrepeso';
    if (bmi <= 34.9) return 'Obesidade grau I';
    if (bmi <= 39.9) return 'Obesidade grau II (severa)';
    return 'Obesidade grau III (mórbida)';
  };

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/list-users');
        if (response.ok) {
          const data = await response.json();
          setApprovedUsers(data);
        } else {
          setErrorMessage('Erro ao buscar usuários aprovados');
        }
      } catch (error) {
        setErrorMessage('Erro ao buscar usuários aprovados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedUsers();
  }, []);

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseWorkoutDetails = () => {
    setSelectedWorkout(null);
  };

  const filteredUsers = approvedUsers.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = async (user) => {
    try {
      const response = await fetch(`/api/admin-workout-history?userId=${user._id}`);

      if (response.ok) {
        const data = await response.json();

        setSelectedUser({ ...user, workoutHistory: data || [] });

      } else {
        console.error('Erro ao buscar histórico de treinos.');
      };

    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error);
    };
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <>
      <div><AdminNavBar /></div>
      <div className={styles.container}>
        <h1 className={styles.title}>Histórico de Treinos</h1>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {isLoading && <div className={styles.loadingSpinner} />}

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} />
        </div>

       
        {!selectedUser && (
          <div className={styles.userGrid}>
            {filteredUsers.map((user) => (
              <div key={user.email} className={styles.userCard}>
                <div className={styles.userHeader} onClick={() => toggleUserCard(user._id)}>
                  <div className={styles.userHeaderContent}>
                    <User className={styles.iconUser} />
                    <h3>{user.nome}</h3>
                  </div>
                  <ChevronDown 
                    className={`${styles.chevronIcon} ${expandedUserId === user._id ? styles.chevronRotated : ''}`}
                  />
                </div>
                
                <div className={`${styles.userDetails} ${expandedUserId === user._id ? styles.expanded : ''}`}>
                  <div className={styles.userEmail}>
                    <Mail className={styles.icon} />
                    <p>{user.email}</p>
                  </div>
                  <div className={styles.userEmail}>
                    <Phone className={styles.icon} />
                    <p>{user.phone || 'Número não definido'}</p>
                  </div>
                  <div className={styles.userGoal}>
                    <Target className={styles.icon} />
                    <span>{user.mainObject || 'Objetivo não definido'}</span>
                  </div>
                  <div className={styles.userGoal}>
                    <Weight className={styles.icon} />
                    <span>{user.weight || 'Peso não definido'} Kg</span>
                  </div>
                  <div className={styles.userGoal}>
                    <Ruler className={styles.icon} />
                    <span>{user.height || 'Altura não definido'} m</span>
                  </div>

                  <div className={styles.userGoal}>
                    <svg
                      className={styles.icon}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 20h20" />
                      <path d="M6 16V4" />
                      <path d="M18 16V4" />
                      <path d="M14 16V4" />
                      <path d="M10 16V4" />
                    </svg>
                    {user.weight && user.height ? (
                      <span>IMC: {calculateBMI(user.weight, user.height)} - {getBMICategory(calculateBMI(user.weight, user.height))}</span>
                    ) : (
                      <span>Dados insuficientes para cálculo do IMC</span>
                    )}
                  </div>

                  <button 
                    className={styles.viewHistoryBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user);
                    }}
                  >
                    Ver Histórico
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedUser ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.userHeaderInfo}>
                <User className={styles.headerIcon} />
                <div>
                  <h2 className={styles.cardTitle}>{selectedUser.nome}</h2>
                  <p className={styles.userEmail}></p>
                </div>
              </div>
              <button className={styles.backButton} onClick={handleBackToList}>
                <X />
              </button>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.historyTitle}>Histórico Semanal de Treinos</h3>
              <div className={styles.workoutList}>
                {selectedUser?.workoutHistory?.length > 0 ? (
                  selectedUser.workoutHistory.map((workout, index) => (
                    <div
                      key={index}
                      className={styles.workoutItem}
                      onDoubleClick={() => handleWorkoutClick(workout)}
                    >
                      <div className={styles.workoutHeader}>
                        <div className={styles.workoutInfo}>
                          <Dumbbell className={styles.workoutIcon} />
                          <div>
                            <h4 className={styles.workoutTitle}>
                              Treino {workout.workoutStatus}
                            </h4>
                            <span className={styles.workoutDate}>{getFormattedDate(workout.date)}</span>
                          </div>
                        </div>
                        {workout.workoutStatus === 'Pago' ? (
                          <Check className={styles.statusIconPago} />
                        ) : (
                          <MinusCircle className={styles.statusIcon} />
                        )}
                        <ChevronRight className={styles.chevronIcon} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noWorkouts}>Nenhum treino encontrado.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {selectedWorkout && (
          <div className={styles.modal} onClick={handleCloseWorkoutDetails}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Detalhes do Treino</h2>
                <button className={styles.closeButton} onClick={handleCloseWorkoutDetails}>
                  <X />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.workoutMeta}>
                  <div className={styles.workoutDate}>
                    <Calendar className={styles.metaIcon} />
                    <span className={styles.metaDate}>{getFormattedDate(selectedWorkout.date)}</span>
                  </div>
                </div>

                <h3 className={styles.workoutDescription}>
                  <p>Objetivo {selectedUser.mainObject}</p>
                </h3>

                <div className={styles.exercisesList}>
                  {selectedWorkout.muscleGroups?.map((muscleGroup, index) => (

                    <div key={index} className={styles.exerciseCard}>
                      <h4 className={styles.exerciseNameMuscle}>{muscleGroup.muscle}</h4>
                      <ul>
                        {muscleGroup.exercises.map((exercise, exerciseIndex) => (
                          <li className={styles.exerciseName} key={exerciseIndex}>{exercise}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkoutHistory;

