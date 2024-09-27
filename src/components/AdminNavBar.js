import React from 'react';

const AdminNavBar = () => {
  return (
    <nav className='navbar'>
      <div className='brand'>
        <p>BestFit</p>
      </div>
      <ul className='navList'>
        <li className='navItem'>Dashboard</li>
        <li className='navItem'>Alunos</li>
        <li className='navItem'>Treinos</li>
        <li className='navItem'>Perfil</li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
