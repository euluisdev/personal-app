'use client';

import { useState, useEffect } from 'react';
import UserNavBar from '@/components/UserNavBar';

import styles from '../../styles/user-analize/page.module.css';

const UserAnalize = () => {
    const [workoutData, setWorkoutData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            try {
              const response = await fetch("http://localhost:8000/workouts", {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
              });
        
              if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
              }
          const data = await response.json();
  
          if (data.message) {
            setError(data.message);
          } else {
            setWorkoutData(data.image);
          }
        } catch (err) {
          setError('Erro ao carregar dados');
        } finally {
          setLoading(false);
        }
      };
  
      fetchWorkoutData();
    }, []);
  
    return (
        <>
    <div><UserNavBar /></div>
      <div className={styles.container}>
        
        <div className={styles.content}>
          <h1>Meus Treinos</h1>
          
          {loading && <p>Carregando...</p>}
          
          {error && <p className={styles.error}>{error}</p>}
          
          {workoutData && (
            <img 
              src={workoutData} 
              alt="Gráfico de treinos" 
              className={styles.graph}
            />
          )}
        </div>
      </div>
      </>
    );
  };
  
  export default UserAnalize;