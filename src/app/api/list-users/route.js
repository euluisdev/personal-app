// /app/api/list-users/route.js
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Variável não definida');
}; 

const jwtSecret = process.env.JWT_SECRET;

export async function GET(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Token não fornecido' }), { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      if (decoded.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Acesso não autorizado' }), { status: 403 });
      }
  
      const client = new MongoClient(uri);
      await client.connect();
      const collection = client.db('BestFitData').collection('users');
      
      const users = await collection.find({ status: 'pendente' }).toArray();
      return new Response(JSON.stringify(users), { status: 200 });
  
    } catch (error) {
      console.error('Erro durante a verificação do token ou consulta ao banco:', error.message);
      return new Response(JSON.stringify({ message: 'Token inválido ou erro interno' }), { status: 401 });
    };
  };
 
