'use client';
import { useSearchParams } from 'next/navigation';

const page = () => {
    const searchParams = useSearchParams();
    const userName = searchParams.get('userName') || 'Usuário'; // Obtém o nome passado pela URL

    return (
        <>
            <div style={{ opacity: 1, display: 'block', position: 'relative', zIndex: 10 }} >
                <h1>Bem-vindo, {userName}!</h1>
                <p>Estamos felizes em tê-lo de volta. Aproveite seu treino!</p>
            </div>
        </>
    );
};

export default page;  
 
