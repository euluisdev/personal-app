
// AdminDashboard.js
import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Envia o token do admin
        },
      });
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleApprove = async (email) => {
    const response = await fetch('/api/approve-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      alert('Usuário aprovado com sucesso!');
      setUsers(users.filter(user => user.email !== email)); // Remove o usuário aprovado da lista
    } else {
      alert('Erro ao aprovar o usuário.');
    }
  };

  return (
    <div>
      <h1>Painel Administrativo</h1>
      <h2>Usuários Pendentes</h2>
      <ul>
        {users.map(user => (
          <li key={user.email}>
            {user.nome} ({user.email}) - <button onClick={() => handleApprove(user.email)}>Aprovar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;

