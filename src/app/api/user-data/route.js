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
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId;

    const client = new MongoClient(uri);
    await client.connect(); 
    const collection = client. db('BestFitData').collection('users'); 

    const user = await collection.findOne({ _id: userId });

    await client.close();  //close connection

    if (!user) {
        return new Response(JSON.stringify({ message: 'Usuário não encontrado' }), { status: 404 });
    };
  
    return new Response(JSON.stringify({ 
        name: user.nome, 
        email: user.email 

    }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }

    });

    
} catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
}; 

 
