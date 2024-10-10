'use client';

import React, { useState, useEffect } from 'react';
import { User, Calendar, Target, Search, X } from 'lucide-react';

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-workout/page.module.css';

const WorkoutHistory = () => {
  const [approvedUsers, setApprovedUsers] = useState([]); 
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const response = await fetch('/api/list-users');

        if (response.ok) {
          const data = await response.json();
          setApprovedUsers(data);
        } else {
          console.error('Erro ao buscar usuários aprovados');
        };

      } catch (error) {
        console.error('Erro ao buscar usuários aprovados:', error);
      }
    };

    fetchApprovedUsers();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  }; 

  const handleBackToList = () => {
    setSelectedUser(null);
  }; 

  const filteredUsers = approvedUsers.filter((user) => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  const fetchWorkoutHistory = async (userId) => {
    try {
      const response = await fetch(`/api/workout-history/${userId}`);
      if (response.ok) {
        const data = await response.json(); 
        return data;
      } else {
        console.error('Erro ao buscar histórico de treinos.'); 
        return [];
      }

    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error); 
      return [];
    }
  };

  return (
    <>
    <div><AdminNavBar /></div>
    <div className={styles.container}>
      <h1 className={styles.title}>Histórico de Treino</h1>

      {message && <p className={styles.message}>{message}</p>}

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
              {selectedUser.workoutHistory.map((day, index) => (
                <li key={index} className={styles.workoutItem}>
                  <span>{day.day}</span>
                  <span className={day.workout === 'Concluído' ? styles.completed : styles.notCompleted}>
                    {day.workout}
                  </span>
                </li>
              ))}
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
    </div>
    </>
  );
};

export default WorkoutHistory;
