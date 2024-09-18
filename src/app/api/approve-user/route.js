// /app/api/approve-user/route.js
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function GET(req) {
  try {
    //verifica se o token de autorização está presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Autorização necessária.' }), { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    //verifica o token JWT
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Acesso não autorizado.' }), { status: 403 });
    }

    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');

    //busca usuários com status pendente
    const pendingUsers = await collection.find({ status: 'pendente' }).toArray();

    return new Response(JSON.stringify(pendingUsers), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuários pendentes:', error.message);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  try {
    //verifica se o token de autorização está presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Autorização necessária.' }), { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    //verifica o token JWT
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Acesso não autorizado.' }), { status: 403 });
    }

    //obtém o e-mail do corpo da requisição
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ message: 'E-mail do usuário é necessário.' }), { status: 400 });
    }

    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');

    //atualiza o status do usuário para 'aprovado'
    const result = await collection.updateOne(
      { email },  // critério de busca
      { $set: { status: 'aprovado' } }  // atualização  
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'Usuário não encontrado.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Usuário aprovado com sucesso.' }), { status: 200 });
  } catch (error) {
    console.error('Erro ao aprovar usuário:', error.message);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  } finally {
    await client.close();
  }
}
