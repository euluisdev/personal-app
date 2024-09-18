// /pages/api/approve-user.js
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function POST(req) {
  try {
    // Verifica se o token de autorização está presente
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Autorização necessária.' }), { status: 401 });
    }

    // Verifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Acesso não autorizado.' }), { status: 403 });
    }

    // Obtém o e-mail do corpo da requisição
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ message: 'E-mail do usuário é necessário.' }), { status: 400 });
    }

    // Conecta ao banco de dados
    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');

    // Atualiza o status do usuário para 'aprovado'
    const result = await collection.updateOne(
      { email },  // Critério de busca (usuário com o e-mail fornecido)
      { $set: { status: 'aprovado' } }  // Atualização (altera o status para 'aprovado')
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
