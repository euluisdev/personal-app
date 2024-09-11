import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    const db = client.db('bestFitData');
    const collection = db.collection('users');
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

export async function POST(req) {
  try {
    const { nome, datanasc, sexo, peso, altura, alergia, lesao, iniciante, objetivo, hora, email, senha } = await req.json();

    const { collection } = await connectToDatabase();

    //verifica se o email já existe
    const userExists = await collection.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ message: 'Usuário já cadastrado.' }), { status: 409 });
    }

    //criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    //cria o novo usuário
    await collection.insertOne({
      nome,
      datanasc,
      sexo,
      peso,
      altura,
      alergia,
      lesao,
      iniciante,
      objetivo,
      hora,
      email,
      senha: hashedPassword,
      status: 'pendente', 
    });

    return new Response(JSON.stringify({ message: 'Cadastro realizado com sucesso!' }), { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  }
}

