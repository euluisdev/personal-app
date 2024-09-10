'use client';
import { useSearchParams } from 'next/navigation'; // Verifique se o import está correto
import { useState, useEffect, Suspense } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');

  const [data, setData] = useState(null);

  useEffect(() => {

    if (userName) {
      console.log(`UserName from query: ${userName}`);
    }
  }, [userName]);

  return (
    <>
        <Suspense fallback={<div>Carregando...</div>}>
        <div style={{ opacity: 1, display: 'block', position: 'relative', zIndex: 10 }} > 
            <h1>Bem-vindo, {userName}!</h1>
            <p>Estamos felizes em tê-lo de volta. Aproveite seu treino!</p>
        </div>
        </Suspense>
    </>
);
}

export default Page;
