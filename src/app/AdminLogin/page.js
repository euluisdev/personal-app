'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import dotenv from 'dotenv';
 dotenv.config();

/* import styles from './page.module.css'; */ 

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
      /*   localStorage.setItem('adminToken', data.token); */
        router.push('/admin-dashboard');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login do administrador:', error);
      setMessage('Erro ao processar o login.');
    }
  };

  return (
    <div /* className={styles['login-container']} */>
      <h1>Login do Administrador</h1>
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
  ); 
};  

