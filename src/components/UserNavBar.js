import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './UserNavBar.css';

const UserNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);  

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('api/user-profile');
                const data = await response.json(); 

                if (response.ok) {
                    setProfilePhoto(data)
                } else {
                    console.error(`Erro na resposta da API!`, data);
                }

            } catch (error) {
                console.error('Erro ao buscar file:', error); 

            } finally {
                setIsLoading(false);
            }
        };
        fetchProfilePhoto();   
    }, [])

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

            {isLoading && <div className='loadingSpinner'/>}

            {profilePhoto && (
              <img 
                src={profilePhoto.photoUrl} 
                alt="Foto do Perfil"    
                className='profileImage'
              />
            )}

        </nav>
    );
};

export default UserNavBar;
