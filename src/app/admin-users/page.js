'use client';

import React, { useEffect, useState } from 'react';

import AdminNavBar from '@/components/AdminNavBar'; 

import styles from '../../styles/admin-users/page.module.css';
import { useRouter } from 'next/navigation';

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
    <div className={styles['users-container']}>
      <div><AdminNavBar /></div>
      <h1>Usuários</h1>
      <div>
        <h2>Usuários Aprovados</h2>
        <ul>
          {approvedUsers.length > 0 ? (
            approvedUsers.map(user => (
              <li key={user.email}>
                {user.nome} - {user.email}
                <button onClick={() => handleSelectUser(user)}>Selecionar para Treino</button>
              </li>
            ))
          ) : (
            <p>Não há usuários aprovados.</p>
          )}
        </ul>

        {selectedUser && (
          <div>
            <h2>Criar Treino para {selectedUser.nome}</h2>
            <form onSubmit={handleSubmitWorkout}>
              <div>
                <label htmlFor="description">Descrição do Treino:</label>
                <textarea
                  id="description"
                  name="description"
                  value={workoutForm.description}
                  onChange={handleWorkoutFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="date">Data do Treino:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={workoutForm.date}
                  onChange={handleWorkoutFormChange}
                  required
                />
              </div>
              <button type="submit">Criar Treino</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
