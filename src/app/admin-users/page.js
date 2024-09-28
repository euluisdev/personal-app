'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavBar from '@/components/AdminNavBar'; 
import { User, Calendar, Target } from 'lucide-react'; 

import styles from '../../styles/admin-users/page.module.css';

const Page = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);  
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [workoutForm, setWorkoutForm] = useState({ description: '', date: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const response = await fetch('/api/list-users');
        if (response.ok) {
          const data = await response.json();
          setApprovedUsers(data);
        } else {
          console.error('Erro ao buscar usuários aprovados');
        }
      } catch (error) {
        console.error('Erro ao buscar usuários aprovados:', error);
      }
    };

    fetchApprovedUsers();
  }, [router]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleWorkoutFormChange = (e) => {
    setWorkoutForm({ ...workoutForm, [e.target.name]: e.target.value });
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage('Selecione um usuário primeiro.');
      return;
    }

    try {
      const response = await fetch('/api/create-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          workoutData: workoutForm
        }),
      });

      if (response.ok) {
        setMessage('Treino criado com sucesso.');
        setWorkoutForm({ description: '', date: '' }); 
        
      } else {

        const errorData = await response.json();
        setMessage(errorData.message || 'Erro ao criar treino.');
      };

    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setMessage('Erro ao processar a requisição.');
    };
  };

  return (
<div className={styles.container}>
      <AdminNavBar />
      <div className={styles.content}>
        <h1 className={styles.title}>Gerenciamento de Usuários</h1>
        {message && <p className={styles.message}>{message}</p>}
        
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Usuários Aprovados</h2>
            <ul className={styles.userList}>
              {approvedUsers.length > 0 ? (
                approvedUsers.map(user => (
                  <li key={user.email} className={styles.userItem}>
                    <div className={styles.userInfo}>
                      <User className={styles.icon} />
                      <div>
                        <strong>{user.nome}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className={styles.userGoal}>
                      <Target className={styles.icon} />
                      <span>{user.objetivoPrincipal || 'Não definido'}</span>
                    </div>
                    <button 
                      className={styles.selectButton}
                      onClick={() => handleSelectUser(user)}
                    >
                      Selecionar
                    </button>
                  </li>
                ))
              ) : (
                <p>Não há usuários aprovados.</p>
              )}
            </ul>
          </div>

          {selectedUser && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Criar Treino para {selectedUser.nome}</h2>
              <form onSubmit={handleSubmitWorkout} className={styles.workoutForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="description">Descrição do Treino:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={workoutForm.description}
                    onChange={handleWorkoutFormChange}
                    required
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="date">Data do Treino:</label>
                  <div className={styles.dateInputWrapper}>
                    <Calendar className={styles.icon} />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={workoutForm.date}
                      onChange={handleWorkoutFormChange}
                      required
                      className={styles.dateInput}
                    />
                  </div>
                </div>
                <button type="submit" className={styles.submitButton}>Criar Treino</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
