import React, { useState } from 'react';
import Link from 'next/link';
import './AdminNavBar.css';

const AdminNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='navbar'>
            <div className='brand'>
                <p>BestFit</p>
            </div>
            <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span className='bar'></span>
                <span className='bar'></span>
                <span className='bar'></span>
            </div>
            <ul className={`navList ${isOpen ? 'navListOpen' : ''}`}>
                <li className='navItem'>
                    <Link href="/admin-dashboard">Dashboard</Link>
                </li>
                <li className='navItem'>
                    <Link href="/admin-users">Alunos</Link>
                </li>
                <li className='navItem'>
                    <Link href="/admin-workout">Treinos</Link>
                </li>
                <li className='navItem'>
                    <Link href="/admin-profile">Perfil</Link>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavBar;


