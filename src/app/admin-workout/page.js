'use client';

import AdminNavBar from '@/components/AdminNavBar';

import styles from '../../styles/admin-workout/page.module.css';

import React from 'react'

const page = () => {
  return (
    <div className={styles['workout-container']}>
      <div><AdminNavBar /></div>
      <h1>workout</h1>
    </div>
  )
}

export default page;
