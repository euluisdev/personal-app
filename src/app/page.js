'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';

import styles from '../styles/admin-login/page.module.css';

export default function UserLogin() {
  const router = useRouter();
  const [formType, setFormType] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    mainObject: '',
    height: '',
    weight: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  const objetivos = [
    'Hipertrofia',
    'Perder peso',
    'Ganhar massa',
    'Condicionamento',
    'Força',
    'Saúde geral'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'login' ? '/api/login' : '/api/register';

/*     const formattedData = {
      ...formData,
      height: formData.height.replace(',', '.'),
      weight: formData.weight.replace(',', '.')
    }; */

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
          Cookies.set('authToken', data.token, { path: '/' });
          router.push('/dashboard');
        };

        setFormData({
          nome: '',
          email: '',
          senha: '',
          mainObject: '',
          height: '',
          weight: '',
          phone: '', 
        });

      } else {
        setMessage(data.message);
      };

    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao processar a requisição.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user-forgot-password', {
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
      };

    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao processar a solicitação de redefinição de senha.');
    };
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '');
      if (value.length >= 11) {
        value = `(${value.slice(0,2)})${value.slice(2,11)}`;
      };
    };

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
              <>
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

                <div className={styles['input-group']}>
                  <select
                    name="mainObject"
                    value={formData.mainObject}
                    onChange={handleChange}
                    required
                    className={styles['select-input']}
                  >
                    <option className={styles['option-label']} value="" >Objetivo Principal</option>
                    {objetivos.map((objetivo) => (
                      <option key={objetivo} value={objetivo}>
                        {objetivo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles['row-inputs']}>
                  <div className={styles['input-group-half']}>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Altura (m)</label>
                  </div>
                  <div className={styles['input-group-half']}>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Peso (kg)</label>
                  </div>
                </div>
              </>
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

            {formType === 'register' && (
              <div className={styles['input-group']}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=" "
                  maxLength="12"
                  required
                />
                <label>Telefone</label>
              </div>
            )}

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
 
 
 


