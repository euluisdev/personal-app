'use client';

import { useState, useEffect } from 'react';
import AdminNavBar from '@/components/AdminNavBar';
import { useRouter } from 'next/navigation';

import styles from '../../styles/admin-profile/page.module.css';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    photoUrl: '',
    telefone: '',
    cref: '',
  });
  const [fileData, setFileData] = useState(null);
  const router = useRouter();

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
            telefone: data.telefone || '',
            cref: data.cref || '',
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
      updatedFormData.append('telefone', formData.telefone);
      updatedFormData.append('cref', formData.cref);
    
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
        setFormData((prev) => ({ ...prev, photoUrl: profile.photoUrl }))
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

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...profileData });
    setFileData(null);
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'GET' });
      router.push('/AdminLogin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!profileData) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <AdminNavBar />
      <main className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h1 className={styles.title}>Perfil Profissional</h1>
          {!isEditing && (
            <button onClick={handleEditClick} className={styles.editButton}>
              Editar Perfil
            </button>
          )}
        </div>

        <div className={styles.profileContent}>
          <div className={styles.profileImageContainer}>
            {profileData.photoUrl && (
              <img
                src={profileData.photoUrl}
                alt="Foto do Perfil"
                className={styles.profileImage}
              />
            )}
            {isEditing && (
              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  name="photoUrl"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>
            )}
          </div>

          <div className={styles.profileInfo}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.inputGroup}>
                  <label>Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>CREF</label>
                  <input
                    type="text"
                    name="cref"
                    value={formData.cref}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="000000-G/XX"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Biografia</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows="4"
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button onClick={handleSaveClick} className={styles.saveButton}>
                    Salvar
                  </button>
                  <button onClick={handleCancelClick} className={styles.cancelButton}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.profileDetails}>
                <h2 className={styles.name}>{profileData.nome}</h2>
                <p className={styles.role}>Personal Trainer</p>
                <div className={styles.credentials}>
                  <p className={styles.credentialItem}>
                    <span className={styles.label}>CREF:</span> {profileData.cref}
                  </p>
                  <p className={styles.credentialItem}>
                    <span className={styles.label}>Telefone:</span> {profileData.telefone}
                  </p>
                  <p className={styles.credentialItem}>
                    <span className={styles.label}>Email:</span> {profileData.email}
                  </p>
                </div>
                <div className={styles.bioContainer}>
                  <h3>Sobre mim</h3>
                  <p className={styles.bio}>{profileData.bio}</p>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;