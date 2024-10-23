'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from '../styles/admin-login/page.module.css';

export default function UserLogin() {
  const router = useRouter();
  const [formType, setFormType] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',

  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'login' ? '/api/login' : '/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          document.cookie = `authToken=${data.token}; path=/`;
          router.push('/dashboard');
        }
        setFormData({
          nome: '',
          email: '',
          senha: '',
        });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao processar a requisição.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao processar a solicitação de redefinição de senha.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigateToAdminLogin = () => {
    router.push('/AdminLogin');
  };

  return (
    <div className={`${styles['modal-overlay']} ${styles['page-transition']}`}>
      <div className={styles['modal-container']}>
        <div className={styles['switch-container']}>
          <div className={styles['switch-track']} onClick={navigateToAdminLogin}>
            <div className={styles['switch-thumb']}>
              <span className={`${styles['switch-label']} ${styles.user}`}>
                Aluno
              </span>
            </div>
          </div>
        </div>

        <h1 className={styles['modal-title']}>
          {formType === 'login' ? 'Login' : 'Cadastro'}
        </h1>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className={styles['form-container']}>
            <div className={styles['input-group']}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Email</label>
            </div>
            <button type="submit" className={styles['submit-button']}>
              Redefinir Senha
            </button>
            <button
              type="button"
              className={styles['toggle-form']}
              onClick={() => setShowForgotPassword(false)}
            >
              Voltar ao Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className={styles['form-container']}>
            {formType === 'register' && (
              <div className={styles['input-group']}>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Nome</label>
              </div>
            )}
            <div className={styles['input-group']}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Email</label>
            </div>
            <div className={styles['input-group']}>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Senha</label>
            </div>

            {formType === 'login' && (
              <button
                type="button"
                className={styles['forgot-password']}
                onClick={() => setShowForgotPassword(true)}
              >
                Esqueceu a senha?
              </button>
            )}

            <button type="submit" className={styles['submit-button']}>
              {formType === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>

            <button
              type="button"
              className={styles['toggle-form']}
              onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
            >
              {formType === 'login'
                ? 'Criar uma conta'
                : 'Já possui uma conta? Faça login'}
            </button>
          </form>
        )}

        {message && <p className={styles['error-message']}>{message}</p>}
      </div>
    </div>
  );
}
 
 
 


