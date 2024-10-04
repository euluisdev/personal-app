'use client';

import AdminNavBar from '@/components/AdminNavBar';
import { useState, useEffect } from 'react';

import styles from '../../styles/admin-profile/page.module.css'

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin-profile'); 
        const data = await response.json();
        console.log(data);
        if (data) {
          setProfileData(data);
          setFormData({
            name: data.name, 
            email: data.email, 
            bio: data.bio,
          });
        } else {
          console.error(`Error na resposta da API!`);
        }

      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfileData(updatedProfile);
        setIsEditing(false); 
      }

    } catch (error) {
      console.error('Error updating profile:', error);
    };
  };

  const handleEditClick = () =>{
    setIsEditing(true);
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles['profile-container']}>
      <div><AdminNavBar /></div>
      <h1>Profile</h1>

      <div className={styles.profileCard}>
        <img
          src={profileData.photoUrl}
          alt="Profile"
          className={styles.profileImage}
        />

        {isEditing ? (
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
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
            <h1 className={styles.name}>{profileData.name}</h1>
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