'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import UserNavBar from '@/components/UserNavBar';

import styles from '../../styles/user-analize/page.module.css';

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

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
        setWorkoutData(data);
        
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
        {loading && <p>Carregando gráfico...</p>}

        {error && <p className={styles.error}>{error}</p>}
        
        {workoutData && (
          <Plot
            data={JSON.parse(workoutData).data}
            layout={JSON.parse(workoutData).layout}
            style={{ width: '50%', height: '400px', marginTop: '7rem' }}
          />
        )}
      </div>
    </>
  );
};

export default UserAnalize;