'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from '../../styles/reset-password/page.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Senha redefinida com sucesso!');
        router.push('/login'); 
        
      } else {
        setMessage(data.message);
      };

    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao processar a requisição.');
    }
  };

  return (
    <div className={styles['container']}>
      <h1 className={styles['title']}>Redefinir Senha</h1>
      <form onSubmit={handleSubmit} className={styles['form']}>
        <div className={styles['input-group']}>
          <input
            className={styles['input']}
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label className={styles['label']}>Nova Senha</label>
        </div>
        <div className={styles['input-group']}>
          <input 
            className={styles['input']} 
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label className={styles['label']}>Confirmar Senha</label>
        </div>

        <button type="submit" className={styles['submit-button']} >
          Redefinir Senha
        </button>

      </form>
      {message && <p className={styles['message']}>{message}</p>}
    </div>
  );
};     
 
 
 

