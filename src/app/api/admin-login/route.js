// /app/api/admin-login.js
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');

    const user = await collection.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), { status: 401 });
    }

    if (user.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Acesso não autorizado.' }), { status: 403 });
    }

    //gera um token JWT para o admin
    if (!jwtSecret) {
        console.error('JWT_SECRET não está definido');
        return new Response(
          JSON.stringify({ message: 'Erro de configuração do servidor.' }),
          { status: 500 }
        );
    };

    const token = jwt.sign({ email: user.email, role: user.role }, jwtSecret, {
      expiresIn: '1h',
    });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Erro no login do administrador:', error.message);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  } finally {
    await client.close();
  }
}

