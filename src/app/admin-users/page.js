'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Target, Search } from 'lucide-react';
import axios from 'axios';

import AdminNavBar from '@/components/AdminNavBar';
import Footer from '@/components/footer';

import styles from '../../styles/admin-users/page.module.css';

const Page = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [workoutForm, setWorkoutForm] = useState({
    muscle: '',
    level: '',
    category: '',
    description: '',
    date: '',
    exercises: []
  });
  const [generatedWorkouts, setGeneratedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const muscles = ['Peitoral', 'Deltoides', 'Trapézio', 'Costas', 'Bíceps ', 'Tríceps', 'Abdômen', 'Quadríceps', 'Isquiotibiais', 'Adutores', 'Gastrocnêmio ', 'Abdutores', 'Glúteos', 'Antebraços'];
  const levels = ['Iniciante', 'Intermediário', 'Avançado', 'Bodybuilder'];
  const categorys = ['Hipertrofia', 'Cardio', 'Máquinas', 'Peso Corporal', 'Elásticos'];
  const canGeneratePreview = selectedUsers.length > 0 &&
    workoutForm.muscle &&
    workoutForm.level &&
    workoutForm.category;

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
  }, [router]);

  //search for users
  const filteredUsers = approvedUsers.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersToDisplay = searchTerm
    ? [...filteredUsers, ...approvedUsers.filter(user => !filteredUsers.includes(user))]
    : approvedUsers;

  //select user
  const handleSelectUser = (user) => {
    const alreadySelected = selectedUsers.find(selected => selected.email === user.email);

    if (alreadySelected) {
      setSelectedUsers(selectedUsers.filter(selected => selected.email !== user.email));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  //dropdown select prompt
  useEffect(() => {
    setPrompt(
      `Treino de ${workoutForm.muscle} ${workoutForm.level} ${workoutForm.category}`
    )
  }, [workoutForm.muscle, workoutForm.level, workoutForm.category]);


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



  //preview workout
  const generateWorkoutPreview = async () => {
    setIsLoading(true);
    try {

      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',
        {
          model: 'command-xlarge-nightly',
          prompt: `Crie um treino de musculação com base nas seguintes informações: ${prompt}. 
                   Inclua apenas cinco exercícios específicos de cada músculo citado, número
                   de séries, repetições, e a máquina que é para fazer o exercício. Apenas isso! sem instruções.`,
          max_tokens: 300,
          temperature: 0.5,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        },
        {
          headers: {
            'Authorization': `BEARER ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data);

      const workoutList = response.data.generations[0].text.split('\n').filter(line => line.trim() !== '');
      setGeneratedWorkouts(workoutList);

    } catch (error) {
      console.error('Erro ao gerar treino:', error);
      setMessage('Erro ao gerar o pré-visualização do treino. Por favor, tente novamente.');

    } finally {
      setIsLoading(false);
    }
  };

  const addExerciseToWorkout = (exercise) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUsers) {
      setMessage('Selecione um usuário primeiro.');
      return;
    }

    if (workoutForm.exercises.length === 0) {
      setMessage('Adicione pelo menos um exercício ao treino.');
      return;
    }

    try {
      const response = await fetch('/api/create-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUsers._id,
          workoutData: workoutForm
        }),
      });

      if (response.ok) {
        setMessage('Treino criado com sucesso.');
        setWorkoutForm({
          description: '',
          date: '',
          daysOfWeek: [],
          level: '',
          bodyPart: [],
          equipment: [],
          exercises: []
        });
        setGeneratedWorkouts([]);
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

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.cardGrid}>
          <div className={styles.cardUsers}>
            <h2 className={styles.cardTitle}>Selecione o Aluno para criar o treino</h2>
            <ul className={styles.userList}>
              {usersToDisplay.length > 0 ? (
                usersToDisplay.map((user) => (
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
                      {selectedUsers.some((selected) => selected.email === user.email) ? 'Selecionado' : 'Selecionar'}
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
              Criar Treino {selectedUsers.length > 0 ? `para ${selectedUsers.map(user => user.nome).join(', ')}` : ''}
            </h2>

            <form onSubmit={handleSubmitWorkout} className={styles.workoutForm}>
              <div className={styles.formGroup}>
                <label htmlFor="muscle">Músculo a ser treinado:</label>
                <select
                  id="muscle"
                  name="muscle"
                  value={workoutForm.muscle}
                  onChange={handleWorkoutFormChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione o Músculo:</option>
                  {muscles.map(muscle => (
                    <option key={muscle} value={muscle}>{muscle}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="level">Nível do treino:</label>
                <select
                  id="level"
                  name="level"
                  value={workoutForm.level}
                  onChange={handleWorkoutFormChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione o Nível:</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Categoria do treino:</label>
                <select
                  id="category"
                  name="category"
                  value={workoutForm.category}
                  onChange={handleWorkoutFormChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione a Categoria:</option>
                  {categorys.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Descrição do Treino:</label>
                <p>{prompt}</p>
              </div>

              <button 
                type="button"
                onClick={generateWorkoutPreview}
                className={`${styles.submitButton} ${!canGeneratePreview ? styles.disabled : ''}`}
                disabled={!canGeneratePreview}
              >
                {isLoading ? 'Gerando...' : 'Gerar Pré-visualização'}
              </button>

              {generatedWorkouts.length > 0 && (
                <div className={styles.previewSection}>
                  <h3 className={styles.previewTitle}>Exercícios Gerados</h3>
                  <div className={styles.generatedWorkouts}>
                    {generatedWorkouts.map((workout, index) => (
                      <div key={index} className={styles.workoutCard}>
                        <p>{workout}</p>
                        <button
                          onClick={() => addExerciseToWorkout(workout)}
                          className={styles.addButton}
                        >
                          Adicionar ao Treino
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {workoutForm.exercises.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Exercícios Selecionados</h2>
              <ul className={styles.selectedExercises}>
                {workoutForm.exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
              
              <div className={styles.finalizeWorkout}>
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

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  onClick={handleSubmitWorkout}
                >
                  Salvar Treino
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}><Footer /></div>
    </div>
  );
};

export default Page;
