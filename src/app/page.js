'use client';
import { useState } from 'react';
import styles from './page.module.css'; // Importando o arquivo CSS

export default function HomePage() {
  const [formType, setFormType] = useState('login'); // Alterna entre login e cadastro
  const [formData, setFormData] = useState({
    nome: '',
    datanasc: '',
    sexo: '',
    peso: '',
    altura: '',
    alergia: '',
    lesao: '',
    iniciante: '',
    objetivo: '',
    hora: '',
    email: '',
    senha: '',
  });
  const [message, setMessage] = useState('');

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'login' ? '/api/login' : '/api/register';

    try {
      // Faz a requisição à API correspondente
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
          datanasc: '',
          sexo: '',
          peso: '',
          altura: '',
          alergia: '',
          lesao: '',
          iniciante: '',
          objetivo: '',
          hora: '',
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
    <div className={styles.container}>
      <h1>{formType === 'login' ? 'Login' : 'Cadastro'}</h1>
      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <>
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
            <div>
              <label>Data de Nascimento:</label>
              <input
                type="date"
                name="datanasc"
                value={formData.datanasc}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Sexo:</label>
              <input
                type="radio"
                name="sexo"
                value="masculino"
                checked={formData.sexo === 'masculino'}
                onChange={handleChange}
                required
              /> Masculino
              <input
                type="radio"
                name="sexo"
                value="feminino"
                checked={formData.sexo === 'feminino'}
                onChange={handleChange}
                required
              /> Feminino
            </div>
            <div>
              <label>Peso (kg):</label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Altura (cm):</label>
              <input
                type="number"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Alergia:</label>
              <input
                type="text"
                name="alergia"
                value={formData.alergia}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Lesão:</label>
              <input
                type="text"
                name="lesao"
                value={formData.lesao}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>É iniciante?:</label>
              <input
                type="text"
                name="iniciante"
                value={formData.iniciante}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Objetivo:</label>
              <input
                type="text"
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Horário disponível do treino (horas):</label>
              <input
                type="number"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              />
            </div>
          </>
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
      <button className={styles.toggle} onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}>
        {formType === 'login' ? 'Criar Conta' : 'Já tenho conta'}
      </button>
    </div>
  );
}
