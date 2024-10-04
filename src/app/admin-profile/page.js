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

  return (
    <div className={styles['profile-container']}>
      <div><AdminNavBar /></div>
      <h1>Profile</h1>
    </div>
  );
};

export default AdminProfile;