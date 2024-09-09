'use client';
import { useState } from 'react';

import "./page.module.css";

export default function HomePage() {
  const [formType, setFormType] = useState('login'); //alternate between login/register
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const [message, setMessage] = useState('');

  //send form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'login' ? '/api/login' : '/api/register';

    try {
      //faz a requisição à API correspondente
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // Limpa os campos após sucesso
        setFormData({
          nome: '',
          email: '',
          senha: '',
        });
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setMessage('Erro ao processar a requisição.');
    }
  };

  // Atualiza os valores dos campos do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
<div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>{formType === 'login' ? 'Login' : 'Cadastro'}</h1>
      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <div>
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
        )}
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
        <button type="submit">
          {formType === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      <p>{message}</p>
      <button onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}>
        {formType === 'login' ? 'Criar Conta' : 'Já tenho conta'}
      </button>
    </div>

  );
};
