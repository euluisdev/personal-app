import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './UserNavBar.css';

const UserNavBar = () => {
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
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className='navItem'>
                    <Link href="/users-hitory">Histórico</Link>
                </li>
                <li className='navItem'>
                    <Link href="/user-workout">Treinos</Link>
                </li>
                <li className='navItem'>
                    <Link href="/user-profile">Perfil</Link>
                </li>
            </ul>

        </nav>
    );
};

export default UserNavBar;
