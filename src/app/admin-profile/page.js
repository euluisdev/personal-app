'use client';

import { useState, useEffect } from 'react';
import AdminNavBar from '@/components/AdminNavBar';
import styles from '../../styles/admin-profile/page.module.css';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', 
    email: '',
    bio: '', 
    photoUrl: '',
  });
  const [fileData, setFileData] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin-profile');
        const data = await response.json();

        if (response.ok) {
          setProfileData(data);
          setFormData({
            nome: data.nome,
            email: data.email,
            bio: data.bio, 
            photoUrl: data.photoUrl, 
          });
        } else {
          console.error(`Erro na resposta da API!`, data);
        }
      } catch (error) {
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
      }
  
      const response = await fetch('/api/admin-profile', {
        method: 'PUT',
        body: updatedFormData
      });
  
      if (response.ok) {
        const { profile } = await response.json();
        setProfileData(profile);
        setIsEditing(false);
      } else {
        console.error('Erro ao atualizar perfil:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
    if (selectedFile); 
      setFileData(selectedFile);
  };

  if (!profileData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <AdminNavBar />
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Perfil</h1> 
        
        {profileData.photoUrl && (
          <img 
            src={profileData.photoUrl} 
            alt="Foto do Perfil" 
            className={styles.profileImage} 
          />
        )}

        {isEditing ? (
          <div>
            <input
              type='file'
              name='photoUrl'
              accept='image/*'
              onChange={handleFileChange}
              className={styles.input}
            />
            <input
              type="text"
              name="nome"
              value={formData.nome} 
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={styles.textarea}
            />
            <button onClick={handleSaveClick} className={styles.saveButton}>
              Salvar
            </button>
          </div>
        ) : (
          <div>
            <h2 className={styles.name}>{profileData.nome}</h2> 
            <p className={styles.role}>Personal Trainer</p>
            <p className={styles.email}>{profileData.email}</p>
            <p className={styles.bio}>{profileData.bio}</p>
            <button onClick={handleEditClick} className={styles.editButton}>
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
