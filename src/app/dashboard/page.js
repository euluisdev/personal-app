// Page.js (renomeado corretamente)

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function Page() {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

// Componente separado para o conteúdo principal
function DashboardContent({ searchParams }) {
  const userName = searchParams.get('userName');
  const userEmail = searchParams.get('userEmail');

  return (
    <div>
      <h1>Bem-vindo, {userName}</h1>
      <p>Ficamos felizes em te ter de volta. </p>
      <p>{userEmail}</p>
    </div>
  );
}



