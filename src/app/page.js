'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react'; 

import styles from './page.module.css'; 

export default function HomePage() {
  const router = useRouter();
  const [formType, setFormType] = useState('login'); 
  const [isAdminLogin, setIsAdminLogin] = useState(false); 
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

  //send form
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
      setMessage(data.message);

      if (response.ok) {
        
        if (data.token) {
          document.cookie = `authToken=${data.token}; path=/`;
          router.push('/dashboard');
        };

        //clean fields
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

      } else {
        setMessage(data.message);
      };

    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setMessage('Erro ao processar a requisição.');
    }; 
  }; 

  //update fields values from form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAdminLogin = () => {
    if (isAdminLogin) {
      setIsAdminLogin(false);
    } else {
      router.push('/AdminLogin');
    };
  }; 

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-title']}>
          <h1 className={styles['modal-title']}>{formType === 'login' ? 'Login' : 'Cadastro'}</h1> 
          <button onClick={toggleAdminLogin} className={styles['admin-toggle']}>
            {isAdminLogin ? 'Aluno' : 'Adm'}
          </button>
        </div>
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
              {/*               <div>
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
              </div> */}
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
          <p>
            {formType === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setFormType('register')}
                >
                  Cadastrar
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setFormType('login')}
                >
                  Entrar
                </button>
              </>
            )}
          </p>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};  

