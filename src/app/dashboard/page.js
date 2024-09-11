'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');
  const userEmail = searchParams.get('userEmail');

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


