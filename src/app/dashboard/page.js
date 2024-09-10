'use client';
import { useSearchParams } from 'next/navigation';

const page = () => {
    const searchParams = useSearchParams();
    const userName = searchParams.get('name') || 'Usuário'; // Obtém o nome passado pela URL

    return (
        <div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Bem-vindo, {userName}!</h1>
                <p>Estamos felizes em tê-lo de volta. Aproveite seu treino!</p>
            </div>
        </div>
    );
};

export default page;  
 
