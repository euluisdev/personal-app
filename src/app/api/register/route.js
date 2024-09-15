import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

// Cria um novo cliente MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Conecta ao banco de dados
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

// Registra um novo usuário
export async function POST(req) {
  try {
    // Extrair os dados da requisição
    const { nome, email, senha } = await req.json();

    // Conecta ao banco de dados
    const { collection } = await connectToDatabase();

    // Verifica se o usuário já está cadastrado pelo email
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Usuário já cadastrado.' }),
        { status: 400 }
      );
    }

    // Criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = {
      nome,
      email,
      senha: hashedPassword,
      status: 'pendente',
      createdAt: new Date(),
    };

    // Adiciona novo usuário à coleção no banco de dados
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

