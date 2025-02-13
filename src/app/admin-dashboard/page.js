'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, Search, User } from 'lucide-react';
import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-dashboard/page.module.css';

const AdminDashboard = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [countUsers, setCountUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin-profile');
        const data = await response.json();

        if (response.ok) {
          setProfileData(data);

        } else {
          console.error(`Erro na resposta da API!`, data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('api/admin-profile');
        const data = await response.json();

        if (response.ok) {
          setProfilePhoto(data)
        } else {
          console.error(`Erro na resposta da API!`, data);
        }

      } catch (error) {
        console.error('Erro ao buscar file:', error);

      } finally {
        setIsLoading(false);
      }
    };
    fetchProfilePhoto();
  }, [])

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

    /*     const fetchNotifications = async () => {
          setNotifications([
            { id: 1, message: "Novo aluno registrado: Maria Silva" },
            { id: 2, message: "João Pereira completou 10 sessões" },
            { id: 3, message: "Atualização de plano necessária para 3 usuários" },
          ]);
        }; */

    fetchCountUsers();
    fetchUsers();
    /*     fetchNotifications(); */
  }, [router]);


  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/admin-notifications');
        const data = await response.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error('Erro ao buscar os últimos treinos pagos:', error);
      }
    };

    fetchWorkouts();

    const interval = setInterval(fetchWorkouts, 120000);

    return () => clearInterval(interval);
  }, []);


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

  useEffect(() => {
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

    fetchApprovedUsers();
  }, [router]);

  const filteredUsers = approvedUsers.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersToDisplay = searchTerm
    ? [...filteredUsers, ...approvedUsers.filter(user => !filteredUsers.includes(user))]
    : approvedUsers;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return now.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className={styles.container}>
      <AdminNavBar />
      <div className={styles.content}>
        <h1 className={styles.title}>
          {getGreeting()},&nbsp;
          {profileData ? profileData.nome : 'Professor'}!<br />
          Hoje é {getFormattedDate()}
        </h1>

        <h1 className={styles.profileImage}>
          {isLoading && <div className='loadingSpinner' />}

          {profilePhoto && (
            <img
              src={profilePhoto.photoUrl}
              alt="Foto do Perfil"
              className={styles.image}
            />
          )}
        </h1>

        {message && <p className={styles.errorMessage}>{message}</p>}

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
              {notifications.length > 0 ? (
                <ul className={styles.userList}>
                  {notifications.map((workout, index) => (
                    <li key={index} className={styles.userItem}>
                      <strong>
                        {workout.userName} concluiu o treino!&nbsp;
                      </strong>
                      <strong>Status:&nbsp;{workout.workoutStatus}</strong>
                      {workout.updatedAt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum treino pago encontrado.</p>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitleChat}>Comunicação com Alunos <MessageSquare className={styles.chatIcon} /></h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar aluno por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <Search className={styles.searchIcon} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.card}>
                <ul className={styles.userList}>
                  {usersToDisplay.length > 0 ? (
                    usersToDisplay.map((user) => (
                      <div
                        key={user.email}
                      >
                        <div className={styles.userInfo}>
                          <div>
                            <strong><User className={styles.iconUser} /></strong>
                            <strong className={styles.nome}> {user.nome}</strong>
                          </div>
                        </div>
                        <span className={styles.mainObject}>({user.mainObject || 'Não definido'})</span>

                      </div>
                    ))
                  ) : (
                    <div>Não há usuários aprovados.</div>
                  )}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;





