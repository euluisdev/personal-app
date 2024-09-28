'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, MessageSquare } from 'lucide-react';
import AdminNavBar from '@/components/AdminNavBar';
import styles from '../../styles/admin-dashboard/page.module.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [countUsers, setCountUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);
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
        }
      } catch (error) {
        console.error('Erro ao contar usuários:', error);
        setMessage('Erro ao processar a requisição.');
      }
    };

    const fetchNotifications = async () => {
      setNotifications([
        { id: 1, message: "Novo aluno registrado: Maria Silva" },
        { id: 2, message: "João Pereira completou 10 sessões" },
        { id: 3, message: "Atualização de plano necessária para 3 usuários" },
      ]);
    };

    fetchCountUsers();
    fetchUsers();
    fetchNotifications();
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

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      } else {
        const errorMessage = await response.json();
        setMessage(errorMessage.message || 'Erro ao aprovar usuário.');
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      setMessage('Erro ao processar a requisição.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'GET' });
      router.push('/AdminLogin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setMessage('Erro ao realizar logout.');
    }
  };

  // Dados de exemplo para o gráfico
  const chartData = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 60 },
  ];

  return (
    <div className={styles.container}>
      <AdminNavBar />
      <div className={styles.content}>
        <h1 className={styles.title}>Painel Administrativo</h1>
        {message && <p className={styles.errorMessage}>{message}</p>}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Usuários</h2>
            <div className={styles.cardContent}>
              <p>Total de Alunos Ativos: {countUsers}</p>
              <p>Usuários Pendentes: {users.length}</p>
              <ul className={styles.userList}>
                {users.map((user) => (
                  <li key={user.email} className={styles.userItem}>
                    {user.nome} - {user.email}
                    <button 
                      className={styles.approveButton}
                      onClick={() => handleApprove(user.email)}
                    >
                      Aprovar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Notificações</h2>
            <div className={styles.cardContent}>
              {notifications.map((notification) => (
                <div key={notification.id} className={styles.notification}>
                  <Bell className={styles.notificationIcon} />
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Análise de Desempenho</h2>
            <div className={styles.cardContent}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#FFD700" />
                  <YAxis stroke="#FFD700" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: '1px solid #FFD700' }}
                    labelStyle={{ color: '#FFD700' }}
                  />
                  <Bar dataKey="value" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Comunicação com Alunos</h2>
            <div className={styles.cardContent}>
              <p>Sistema de chat em desenvolvimento</p>
              <MessageSquare className={styles.chatIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 


   