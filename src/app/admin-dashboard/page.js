'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, MessageSquare } from 'lucide-react';
import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-dashboard/page.module.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [countUsers, setCountUsers] = useState(0)
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

    const fetchCountUsers = async () => {
      try {
        const response = await fetch('/api/count-users');
        if (response.ok) {
          const data = await response.json();
          setCountUsers(data.cont);
        };

      } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao contar usuários' }), { status: 500 });
      }
    };

    fetchCountUsers(); 
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
        <h2>Você possui {countUsers} alunos ativos!</h2>
      </div>
    </div>
  );
};  

   