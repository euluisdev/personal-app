'use client';

import React, { useState, useEffect } from 'react';
import { User, Target, Search, X } from 'lucide-react';

import AdminNavBar from '@/components/AdminNavBar';
import Footer from '@/components/footer';

import styles from '../../styles/admin-workout/page.module.css';

const WorkoutHistory = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

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

  const filteredUsers = approvedUsers.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = async (user) => {
    try {
      const response = await fetch(`/api/admin-workout-history?userId=${user._id}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSelectedUser({ ...user, workoutHistory: data.workoutHistory || [] }); 

      } else {
        console.error('Erro ao buscar histórico de treinos.');
      }

    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error);
    }
  };

  return (
    <>
      <div><AdminNavBar /></div>
      <div className={styles.container}>
        <h1 className={styles.title}>Histórico de Treino</h1>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>} 
        {isLoading && <p className={styles.loading}>Carregando...</p>} 

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

        {selectedUser ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{selectedUser.nome}</h2>
              <button className={styles.backButton} onClick={handleBackToList}>
                <X />
              </button>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.historyTitle}>Histórico Semanal de Treinos</h3>
              <ul className={styles.workoutList}>
                {selectedUser?.workoutHistory?.length > 0 ? (
                  selectedUser.workoutHistory.map((workout, index) => (
                    <li key={index} className={styles.workoutItem}>
                      <span className={workout === 'Concluído' ? styles.completed : styles.notCompleted }>
                        {workout.description}
                      </span>
                      <span>{workout.exercises}</span>  
                      <span>{workout.date}</span>  
                    </li>
                  ))
                ) : (
                  <li className={styles.workoutItem}>Nenhum treino encontrado.</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.userGrid}>
            {filteredUsers.map((user) => (
              <div key={user.email} className={styles.userCard} onClick={() => handleSelectUser(user)}>
                <div className={styles.userInfo}>
                  <User className={styles.icon} />
                  <h3>{user.nome}</h3>
                </div>
                <p className={styles.userEmail}>{user.email}</p>
                <div className={styles.userGoal}>
                  <Target className={styles.icon} />
                  <span>{user.objetivoPrincipal || 'Objetivo não definido'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default WorkoutHistory;

