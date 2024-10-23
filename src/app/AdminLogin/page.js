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
    <div className={`${styles['modal-overlay']} ${styles['page-transition']}`}>
      <div className={styles['modal-container']}>
        <div className={styles['switch-container']}>
          <div className={styles['switch-track']} onClick={handleToggleLogin}>
            <div className={`${styles['switch-thumb']} ${styles.admin}`}>
              <span className={`${styles['switch-label']} ${styles.admin}`}>
                Admin
              </span>
            </div>
          </div>
        </div>

        <h1 className={styles['modal-title']}>Admin Login</h1>

        <form onSubmit={handleSubmit} className={styles['form-container']}>
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

          <button type="submit" className={styles['submit-button']}>
            Entrar como Admin
          </button>
        </form>

        {message && <p className={styles['error-message']}>{message}</p>}
      </div>
    </div>
  ); 
};  

