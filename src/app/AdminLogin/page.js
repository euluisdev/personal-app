'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import dotenv from 'dotenv';
 dotenv.config();

 import styles from '../../styles/admin-login/page.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin-dashboard');

      } else {
        setMessage(data.message);

      };
    } catch (error) {
      console.error('Erro ao fazer login do administrador:', error);
      setMessage('Erro ao processar o login.');
    };
  };

  const handleToggleLogin  = () => {
    router.push('/');
  };  

  return (
    <div className={styles['modal-overlay']} >
      <div className={styles['modal-container']}>
      <div className={styles['login-header']}>
      <h1 className={styles['modal-title']}>Login Administrador</h1>
        <button 
          onClick={handleToggleLogin}
          className={styles['toggle-button']}
        >
          Se não é admin clique aqui!
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Entrar</button>
        {message && <p>{message}</p>}
      </form>
      </div>
    </div>
  ); 
};  

