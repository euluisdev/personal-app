'use client';

import { useState, useEffect } from 'react';
import UserNavBar from '@/components/UserNavBar';

import styles from '../../styles/user-profile/page.module.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    photoUrl: '',
  });
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user-profile', {
          credentials: 'include', 
        });
        const data = await response.json();
        console.log('eu sou', data);

        if (response.ok) {
          setProfileData(data);
          setFormData({
            nome: data.nome,
            email: data.email,
            bio: data.bio,
            photoUrl: data.photoUrl,
          });
          setError(null);

        } else {
          setError(data.error || 'Erro ao carregar perfil');
        };

      } catch (error) {
        setError('Erro ao carregar perfil');
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveClick = async () => {
    try {
      const updatedFormData = new FormData();
      updatedFormData.append('nome', formData.nome);
      updatedFormData.append('email', formData.email);
      updatedFormData.append('bio', formData.bio);
    
      if (fileData) {
        updatedFormData.append('photoUrl', fileData);
      };
  
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        credentials: 'include', 
        body: updatedFormData
      });
  
      if (response.ok) {
        const { profile } = await response.json();
        setProfileData(profile);
        setFormData((prev) => ({ ...prev, photoUrl: profile.photoUrl }));
        setIsEditing(false);
        setError(null);

      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar perfil');
      };

    } catch (error) {
      setError('Erro ao atualizar perfil');
      console.error('Erro ao atualizar perfil:', error);
    };
  };

  const handleEditClick = () => setIsEditing(true);
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...profileData });
    setFileData(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileData(selectedFile);
    }
  };

  if (!profileData && !error) {
    return <div className={styles.loading}>Carregando...</div>;
  };

  return (
    <><nav><UserNavBar /></nav>
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Meu Perfil</h1>
        
        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {profileData?.photoUrl && (
          <img 
            src={profileData.photoUrl} 
            alt="Foto do Perfil" 
            className={styles.profileImage} 
          />
        )}

        {isEditing ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Foto do Perfil</label>
              <input
                type='file'
                name='photoUrl'
                accept='image/*'
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.input}
                placeholder="Seu nome"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Biografia</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={handleCancelClick} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={handleSaveClick} className={styles.saveButton}>
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <h2 className={styles.name}>{profileData.nome}</h2>
            <p className={styles.email}>{profileData.email}</p>
            <p className={styles.bio}>{profileData.bio}</p>
            <button onClick={handleEditClick} className={styles.editButton}>
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default StudentProfile; 


 
