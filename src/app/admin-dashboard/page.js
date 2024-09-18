'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/list-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          setMessage('Erro ao carregar usuários.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuários pendentes:', error);
        setMessage('Erro ao processar a requisição.');
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (email) => {
    try {
      const response = await fetch('/api/approve-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuário aprovado com sucesso.');
        // Atualiza a lista de usuários pendentes
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
}



