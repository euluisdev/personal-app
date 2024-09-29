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
  const [workoutForm, setWorkoutForm] = useState({
    description: '',
    date: '',
    daysOfWeek: [],
    level: '',
    muscleGroups: [],
    equipment: [],
    observations: ''
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const router = useRouter();

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const muscleGroups = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps', 'Abdômen'];
  const equipmentList = ['Halteres', 'Barras', 'Máquinas', 'Peso Corporal', 'Elásticos'];
  const levels = ['Iniciante', 'Intermediário', 'Avançado'];

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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setWorkoutForm(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setWorkoutForm(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setWorkoutForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateWorkout = async () => {
    // Simula a geração de um treino baseado nos dados do formulário
    // Aqui você integraria com a API ExerciseDB
    const workout = workoutForm.muscleGroups.map(group => ({
      group,
      exercises: [
        { name: `Exercício 1 para ${group}`, sets: 3, reps: '10-12' },
        { name: `Exercício 2 para ${group}`, sets: 3, reps: '8-10' },
        { name: `Exercício 3 para ${group}`, sets: 3, reps: '12-15' },
      ]
    }));
    setGeneratedWorkout(workout);
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage('Selecione um usuário primeiro.');
      return;
    };

    await generateWorkout();

    try {
      const response = await fetch('/api/create-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          workoutData: { ...workoutForm, generatedWorkout }
        }),
      });

      if (response.ok) {
        setMessage('Treino criado com sucesso.');
        setWorkoutForm({
          description: '',
          date: '',
          daysOfWeek: [],
          level: '',
          muscleGroups: [],
          equipment: [],
          observations: ''
        });
        setGeneratedWorkout(null);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Erro ao criar treino.');
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setMessage('Erro ao processar a requisição.');
    }
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

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Criar Treino {selectedUser ? `para ${selectedUser.nome}` : ''}
            </h2>
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
              <div className={styles.formGroup}>
                <label>Dias de Treino:</label>
                <div className={styles.checkboxGroup}>
                  {daysOfWeek.map(day => (
                    <label key={day} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="daysOfWeek"
                        value={day}
                        checked={workoutForm.daysOfWeek.includes(day)}
                        onChange={handleWorkoutFormChange}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="level">Nível do Aluno:</label>
                <select
                  id="level"
                  name="level"
                  value={workoutForm.level}
                  onChange={handleWorkoutFormChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione o nível</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Grupos Musculares:</label>
                <div className={styles.checkboxGroup}>
                  {muscleGroups.map(group => (
                    <label key={group} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="muscleGroups"
                        value={group}
                        checked={workoutForm.muscleGroups.includes(group)}
                        onChange={handleWorkoutFormChange}
                      />
                      {group}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Equipamentos Disponíveis:</label>
                <div className={styles.checkboxGroup}>
                  {equipmentList.map(equip => (
                    <label key={equip} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="equipment"
                        value={equip}
                        checked={workoutForm.equipment.includes(equip)}
                        onChange={handleWorkoutFormChange}
                      />
                      {equip}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="observations">Observações:</label>
                <textarea
                  id="observations"
                  name="observations"
                  value={workoutForm.observations}
                  onChange={handleWorkoutFormChange}
                  className={styles.textarea}
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Gerar e Salvar Treino
              </button>
            </form>
          </div>

          {generatedWorkout && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Treino Gerado</h2>
              <div className={styles.generatedWorkout}>
                {generatedWorkout.map((group, index) => (
                  <div key={index} className={styles.workoutGroup}>
                    <h3>{group.group}</h3>
                    <ul>
                      {group.exercises.map((exercise, exIndex) => (
                        <li key={exIndex}>
                          {exercise.name} - {exercise.sets} séries de {exercise.reps} repetições
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
