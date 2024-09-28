'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-dashboard/page.module.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
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
      };
    };

    fetchUsers();
  }, [router]);



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

  return (
    <div className={styles['container']}>
      <div>
        <AdminNavBar />
      </div>
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
      </div>
    </div>
  );
}




