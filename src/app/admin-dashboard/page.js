'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken');
      console.log('Token:', token);
      
      if (!token) {
        setMessage('Token não encontrado. Faça login novamente.');
        router.push('/AdminLogin'); 
        return;
      }

      try {
        const response = await fetch('/api/approve-user', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUsers(data);
        } else if (response.status === 401) {
          setMessage('Sessão expirada. Faça login novamente.');
          router.push('/AdminLogin');
        } else {
          const errorMessage = await response.json();
          setMessage(errorMessage.message || 'Erro ao carregar usuários.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuários pendentes:', error);
        setMessage('Erro ao processar a requisição.');
      }
    };

    fetchUsers();
  }, [router]);

  const handleApprove = async (email) => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      setMessage('Token não encontrado. Faça login novamente.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/approve-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuário aprovado com sucesso.');
        setUsers(users.filter(user => user.email !== email));
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      setMessage('Erro ao aprovar o usuário.');
    }
  };

  return (
    <div>
      <h1>Painel Administrativo</h1>
      {message && <p>{message}</p>}
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.email}>
              {user.nome} - {user.email}
              <button onClick={() => handleApprove(user.email)}>Aprovar</button>
            </li>
          ))
        ) : (
          <p>Não há usuários pendentes.</p>
        )}
      </ul>
    </div>
  );
};




