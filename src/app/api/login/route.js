import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

dotenv.config();  

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    //conecta ao banco de dados e coleção
    const db = client.db('BestFitData');
    const collection = db.collection('users');
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
};

//autentica o usuário
export async function POST(req) {
  try {
    //extrai os dados da requisição
    const { email, senha } = await req.json();

    //conecta ao banco de dados
    const { collection } = await connectToDatabase();

    //procura o usuário pelo email
    const user = await collection.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Usuário não encontrado.' }),
        { status: 404 }
      );
    };

    //verifica se o usuário foi aprovado
    if (user.status !== 'aprovado') {
      return new Response(
        JSON.stringify({ message: 'Usuário ainda não aprovado.' }),
        { status: 403 }
      );
    };

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Senha incorreta.' }),
        { status: 401 }
      );
    };

    //cria um token de sessão
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    //responde com sucesso se a autenticação for ok
    return new Response(
      JSON.stringify({
        message: 'Login bem-sucedido.',
        userName: user.nome,
        userEmail: user.email,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  };
};  


  