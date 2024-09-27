import React, { useState } from 'react';

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
            <div className='hamburger' onClick={toggleMenu}>
                <span className='bar'></span>
                <span className='bar'></span>
                <span className='bar'></span>
            </div>
            <ul className={`navList ${isOpen ? 'navListOpen' : ''}`}>
                <li className='navItem'>Dashboard</li>
                <li className='navItem'>Alunos</li>
                <li className='navItem'>Treinos</li>
                <li className='navItem'>Perfil</li>
            </ul>
        </nav>
    );
};

export default AdminNavBar;

