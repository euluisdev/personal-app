'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  return (
    <div>
      <h1>Bem-vindo, {userName}</h1>
      <p>Ficamos felizes em te ter de volta.</p>
      <p>{userEmail}</p>
    </div>
  );
};

//página principal com `Suspense` encapsulando o uso do `useSearchParams`
export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  );
};


