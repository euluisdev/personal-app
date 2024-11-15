'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{11}$/;
  const heightRegex = /^\d+(\.\d+)?$/;
  const weightRegex = /^\d+(\.\d+)?$/;

  const objetivos = [
    'Hipertrofia',
    'Perder peso',
    'Ganhar massa',
    'Condicionamento',
    'Força',
    'Saúde geral'
  ];

  const validateForm = (currentFormData) => {
    if (formType === 'register') {
      return (
        currentFormData.nome.match(nameRegex) &&
        currentFormData.email.match(emailRegex) &&
        currentFormData.phone.match(phoneRegex) &&
        currentFormData.senha.length >= 8 &&
        currentFormData.height.match(heightRegex) &&
        currentFormData.weight.match(weightRegex) &&
        currentFormData.mainObject !== ''
      );
    }
    return true;
  };

  useEffect(() => {
    if (formType === 'register') {
      setIsSubmitDisabled(!validateForm(formData));
    } else {
      setIsSubmitDisabled(false);
    }
  }, [formData, formType]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'login' ? '/api/login' : '/api/register';

    if (formType === 'register') {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;                                    
      if (!nameRegex.test(formData.nome)) {
        setMessage('Por favor, insira seu nome completo (nome e sobrenome).');
        return;
      };

      const formattedData = {
        ...formData,
        height: formData.height.replace(',', '.'),
        weight: formData.weight.replace(',', '.')
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage('Por favor, insira um email válido.');
        return;
      };

      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(formData.phone)) {
        setMessage('Por favor, insira um número de telefone válido com 11 dígitos.');
        return;
      }

      if (formData.senha.length < 8) {
        setMessage('A senha deve ter no mínimo 8 caracteres.');
        return;
      };

      const heightRegex = /^\d+(\.\d+)?$/;
      const weightRegex = /^\d+(\.\d+)?$/;
      if (!heightRegex.test(formData.height) || !weightRegex.test(formData.weight)) {
        setMessage('Altura e peso devem conter apenas números e, opcionalmente, um ponto.');
        return;
      };
    };

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
        } else {
          setFormData({
            nome: '',
            email: '',
            senha: '',
            mainObject: '',
            height: '',
            weight: '',
            phone: '',
          });
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            router.push('/');
          }, 5000);
        };

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
    const name = e.target.name;

    if (e.target.name === 'nome') {
      value = value.replace(/\d/, '');
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '');
    } else if (e.target.name === 'height' || e.target.name === 'weight') {
      value = value.replace(/[^0-9.]/g, '');
    };

    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setIsSubmitDisabled(!validateForm(newFormData));
  };

  const navigateToAdminLogin = () => {
    router.push('/AdminLogin');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
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
                  <label>Nome Completo</label>
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
                type={showPassword ? 'text' : 'email'}
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
                  maxLength="11"
                  required
                />
                <label>Telefone</label>
              </div>
            )}

            <div className={styles['input-group']}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Senha</label>
              <div
                className={`${styles['password-toggle']} ${showPassword ? styles['show'] : ''
                  }`}
                onClick={togglePassword}
              >
                {showPassword ? '👁' : '👁️‍🗨️'}
              </div>
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

            <button
              type="submit"
              className={`${styles['submit-button']} ${formType === 'register' && isSubmitDisabled ? styles['submit-button-disabled'] : ''}`}
              disabled={formType === 'register' && isSubmitDisabled}
            >
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

      {showSuccessModal && (
        <div className={styles['success-modal']}>
          <div className={styles['success-modal-content']}>
            <h3 className={styles['success-modal-title']}>Cadastro Enviado</h3>
            <p className={styles['success-modal-message']}>
              Seu cadastro foi enviado para aprovação do nosso personal. Faça o Login!
            </p>
            <button
              className={styles['success-modal-button']}
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/');
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}





