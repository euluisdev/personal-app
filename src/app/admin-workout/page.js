'use client';

import React, { useState } from 'react'; 
import axios from 'axios'; 

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-workout/page.module.css';

const WorkoutGenerator = () => {
  const [prompt, setPrompt] = useState(''); 
  const [generatedWorkout, setGeneratedWorkout] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  

  const generateWorkout = async () => {
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
      setGeneratedWorkout(workoutList);

    } catch (error) {
      console.error('Erro ao gerar treino:', error);
      setGeneratedWorkout('Erro ao gerar o treino. Por favor, tente novamente.');
    } finally {
    setIsLoading(false);
  }
  }; 

  const handleEdit = (index, field, value) => {
    const updatedWorkout = [...generatedWorkout];
    updatedWorkout[index] = { ...updatedWorkout[index], [field]: value };
    setGeneratedWorkout(updatedWorkout);
  };

  return (
    <div className={styles['container']}>
      <div><AdminNavBar /></div>
      <h1>Gerador de Treino</h1>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Descreva o treino desejado (ex: treino de peito e tríceps para intermediários)"
      />
      <button onClick={generateWorkout} disabled={isLoading}>
        {isLoading ? 'Gerando...' : 'Gerar Treino'}
      </button> 

      {generatedWorkout.length > 0 && (
        <div>
          <h3>Treino Gerado:</h3>
          <table className={styles['workout-table']}>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Exercício</th>
                <th>Séries</th>
                <th>Repetições</th>
                <th>Máquina</th>
              </tr>
            </thead>
            <tbody>
              {generatedWorkout.map((workout, index) => {
                const [exercise, sets, reps, machine] = workout.split(','); // Assume que cada linha tem exercício, séries, repetições e máquina
                return (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td contentEditable onInput={(e) => handleEdit(index, 'exercise', e.target.innerText)}>{exercise}</td>
                    <td contentEditable onInput={(e) => handleEdit(index, 'sets', e.target.innerText)}>{sets}</td>
                    <td contentEditable onInput={(e) => handleEdit(index, 'reps', e.target.innerText)}>{reps}</td>
                    <td contentEditable onInput={(e) => handleEdit(index, 'machine', e.target.innerText)}>{machine}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};  

export default WorkoutGenerator;
