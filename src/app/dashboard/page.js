'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user-data', {
          method: 'GET',
          credentials: 'include' //isso garante que os cookies sejam enviados com a requisição
        });
        console.log(response)

        if (!response.ok) {
          if (response.status === 401) {
            //se não estiver autenticado, redireciona para a página de login
            router.push('/page');
            return;
          }
          throw new Error('Falha ao buscar dados do usuário');
        }

        const userData = await response.json();

        setUserName(userData.name);
        setUserEmail(userData.email);
      } catch (err) {
        
        setError(`Erro: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  //handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'GET', 
      });

      router.push('/');
    } catch (error) {
      console.error(`Erro ao fazer logout:`, error);
    };
  };

  return (
    <div>
      <h1>Bem-vindo, {userName || 'Aluno'}</h1>
      <p>Ficamos felizes em te ter de volta.</p>
      {userEmail && <p>Email: {userEmail}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};  



