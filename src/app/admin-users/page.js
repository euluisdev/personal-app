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
    bodyPart: [],
    equipment: [],
    observations: ''
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [previewWorkout, setPreviewWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const bodyPart = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs',
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ];
  const equipmentList = ['Halteres', 'Barras', 'Máquinas', 'Peso Corporal', 'Elásticos'];
  const levels = ['3', '4', '5', '6', '7', '8', '9', '10', '11'];

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

  //select user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  //form creating workout
  const handleWorkoutFormChange = (e) => {
    const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
      setWorkoutForm(prev => {
        const currentValue = prev[name] || []; 
  
        if (checked) {
          return {
            ...prev,
            [name]: [...currentValue, value]
          };

        } else {
          return {
            ...prev,
            [name]: currentValue.filter(item => item !== value)
          };
        }
      });

    } else {
      setWorkoutForm(prev => ({ ...prev, [name]: value }));
    }
  };
  


  //consumindo API exercisedb
  const fetchExerciseData = async (bodyPart) => {
    try {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
          'x-rapidapi-key': process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data
        
      } else {
        throw new Error('Erro ao buscar dados da API.');
      }
  
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      return [];
    };
  };

  //preview workout
  const generateWorkoutPreview = async () => {
    setIsLoading(true);
    try {
      const workout = await Promise.all(
        workoutForm.bodyPart.map(async (group) => {

          const exercises = await fetchExerciseData(group.toLowerCase());
          const selectedExercises = exercises
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 5) 
            .map(exercise => ({
              name: exercise.name,
              gifUrl: exercise.gifUrl,
              equipment: exercise.equipment, 
              instructions: exercise.instructions, 
              secondaryMuscles: exercise.secondaryMuscles, 
              sets: 3,
              reps: '10-12',
            }));

          return {
            group,
            exercises: selectedExercises,
          };
        })
      );

      setPreviewWorkout(workout);
    } catch (error) {
      console.error('Erro ao gerar o treino:', error);
      setMessage('Erro ao gerar pré-visualização do treino.');
    } finally {
      setIsLoading(false);
    }
  };


  const generateWorkout = async () => {
    try {
      const workout = await Promise.all(
        workoutForm.bodyPart.map(async (group) => {
          const exercises = await fetchExerciseData(group.toLowerCase());
          return {
            group,
            exercises: exercises.slice(0, 3).map(exercise => ({
              name: exercise.name,
              gifUrl: exercise.gifUrl, //URL img do exercício
              sets: 3,
              reps: '10-12'
            }))
          };
        })
      );

      setGeneratedWorkout(workout);
    } catch (error) {
      console.error('Erro ao gerar o treino:', error);
    }
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage('Selecione um usuário primeiro.');
      return;
    };

    if (!previewWorkout) {
      setMessage('Gere uma pré-visualização do treino primeiro.');
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
          workoutData: { ...workoutForm, generatedWorkout: previewWorkout }
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
{/*               <div className={styles.formGroup}>
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
              </div> */}
              <div className={styles.formGroup}>
                <label htmlFor="level">Quantidade de Série:</label>
                <select
                  id="level"
                  name="level"
                  value={workoutForm.level}
                  onChange={handleWorkoutFormChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione a quantidade</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))};
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Grupos Musculares:</label>
                <div className={styles.checkboxGroup}>
                  {bodyPart.map(group => (
                    <label key={group} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="bodyPart"
                        value={group}
                        checked={workoutForm.bodyPart.includes(group)}
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

              <button type="button" onClick={generateWorkoutPreview} className={styles.previewButton} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Pré-visualização'}
              </button>

              <button type="submit" className={styles.submitButton} disabled={!previewWorkout} onClick={generateWorkout}>
                Salvar Treino
              </button>
            </form>
          </div>

          {previewWorkout && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Pré-visualização do Treino</h2>
              <div className={styles.generatedWorkout}>
                {previewWorkout.map((group, index) => (
                  <div key={index} className={styles.workoutGroup}>
                    <h3>Músculo Principal: {group.group}</h3>
                    <ul>
                      {group.exercises.map((exercise, exIndex) => (
                        <li key={exIndex}>
                          <img src={exercise.gifUrl} alt={exercise.name} width={100} />
                          <p>Nome do Exercício: {exercise.name} - {exercise.sets} séries de {exercise.reps} repetições.</p>
                          <p>Equipamentos: {exercise.equipment}</p>
                          <p>Instruções: {exercise.instructions[0]}</p>
                          <p>Músculos Secundários: {exercise.secondaryMuscles}</p>
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
