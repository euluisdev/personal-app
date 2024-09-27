'use client';

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-profile/page.module.css'

const page = () => {
  return (
    <div className={styles['profile-container']}>
      <div><AdminNavBar /></div>
      <h1>Profile</h1>
    </div>
  );
};

export default page;