import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}


const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

export async function POST(req) {
  try {
    const { 
      nome, 
      email, 
      senha,
      mainObject,
      height,
      weight,
      phone, 
    } = await req.json();

    const { collection } = await connectToDatabase();

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Usuário já cadastrado.' }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = {
      nome,
      email,
      senha: hashedPassword, 
      mainObject, 
      height,
      weight,
      phone,
      status: 'pendente',
      createdAt: new Date(),
    };

    await collection.insertOne(newUser);

    return new Response(
      JSON.stringify({ message: 'Cadastro enviado para aprovação.' }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na requisição de cadastro:', error.message, error.stack);
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}

