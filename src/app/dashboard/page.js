'use client';

import { useEffect, useState } from 'react';

function DashboardContent() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('userToken'); 
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        const response = await fetch('/api/user-data', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do usuário');
        }

        const userData = await response.json();
        setUserName(userData.name);
        setUserEmail(userData.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Bem-vindo, {userName || 'Aluno'}</h1>
      <p>Ficamos felizes em te ter de volta.</p>
      {userEmail && <p>Email:{userEmail}</p>}
    </div>
  );
};

//página principal com `Suspense` encapsulando o uso do `useSearchParams`
export default function Page() {
  return/*  (
    <Suspense fallback={<div>Carregando...</div>}> */
      <DashboardContent />
  /*   </Suspense>
  ); */
};


