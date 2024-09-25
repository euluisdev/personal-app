'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [workoutForm, setWorkoutForm] = useState({ description: '', date: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/approve-user');

        if (response.ok) {
          const data = await response.json();
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

    fetchUsers();
    fetchApprovedUsers();
  }, [router]);

  const handleApprove = async (email) => {
    try {
      const response = await fetch('/api/approve-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuário aprovado com sucesso.');
        setUsers(users.filter(user => user.email !== email));

        setApprovedUsers([...approvedUsers, users.find(user => user.email === email)]);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      setMessage('Erro ao aprovar o usuário.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', {
        method: 'GET',
      });

      router.push('/AdminLogin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setMessage('Erro ao realizar logout.');
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleWorkoutFormChange = (e) => {
    setWorkoutForm({ ...workoutForm, [e.target.name]: e.target.value });
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage('Selecione um usuário primeiro.');
      return;
    }

    try {
      const response = await fetch('/api/create-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: selectedUser.email,
          ...workoutForm
        }),
      });

      if (response.ok) {
        setMessage('Treino criado com sucesso.');
        setWorkoutForm({ description: '', date: '' });
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
    <div>
      <h1>Painel Administrativo</h1>
      {message && <p>{message}</p>}
      <button onClick={handleLogout}>Logout</button>
      
      <h2>Usuários Pendentes</h2>
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

      <h2>Usuários Aprovados</h2>
      <ul>
        {approvedUsers.length > 0 ? (
          approvedUsers.map(user => (
            <li key={user.email}>
              {user.nome} - {user.email}
              <button onClick={() => handleSelectUser(user)}>Selecionar para Treino</button>
            </li>
          ))
        ) : (
          <p>Não há usuários aprovados.</p>
        )}
      </ul>

      {selectedUser && (
        <div>
          <h2>Criar Treino para {selectedUser.nome}</h2>
          <form onSubmit={handleSubmitWorkout}>
            <div>
              <label htmlFor="description">Descrição do Treino:</label>
              <textarea
                id="description"
                name="description"
                value={workoutForm.description}
                onChange={handleWorkoutFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="date">Data do Treino:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={workoutForm.date}
                onChange={handleWorkoutFormChange}
                required
              />
            </div>
            <button type="submit">Criar Treino</button>
          </form>
        </div>
      )}
    </div>
  );
}




