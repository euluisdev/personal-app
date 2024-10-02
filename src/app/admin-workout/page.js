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

      setGeneratedWorkout(response.data.generations[0].text);

    } catch (error) {
      console.error('Erro ao gerar treino:', error);
      setGeneratedWorkout('Erro ao gerar o treino. Por favor, tente novamente.');
    }
  }; 

  return (
    <div className={styles['container']}>
      <div><AdminNavBar /></div>
      <h1>workout</h1>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Descreva o treino desejado (ex: treino de peito e tríceps para intermediários)"
      />
      <button onClick={generateWorkout} disabled={isLoading}>
        {isLoading ? 'Gerando...' : 'Gerar Treino'}
      </button> 

      {generatedWorkout && (
        <div>
          <h3>Treino Gerado:</h3>
          <p>{generatedWorkout}</p>
        </div>
      )}

    </div>
  );
};  

export default WorkoutGenerator;
