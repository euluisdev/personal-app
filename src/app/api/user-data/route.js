import { MongoClient } from "mongodb"; 
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI; 
const jwtSecret = process.env.JWT_SECRET; 

export async function GET(req) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return new Response(JSON.stringify({ message: 'Tokin não fornecido' }), { status: 401 }); 
    };
};

const token = authHeader.split(' ')[1];

try {
    
} catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
}; 
 
