// /pages/api/list-users.js
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.headers.authorization.split(' ')[1]; //obtém o token enviado no header
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Acesso não autorizado' }), { status: 403 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const collection = client.db('BestFitData').collection('users');
    
    const users = await collection.find({ status: 'pendente' }).toArray();
    return new Response(JSON.stringify(users), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  };
};  
 
