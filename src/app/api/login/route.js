import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

dotenv.config();  

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Variável não definida');
}; 

const jwtSecret = process.env.JWT_SECRET;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('BestFitData');
    const collection = db.collection('users');
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

//autenticar o usuário
export async function POST(req) {
  try {
    const { email, senha } = await req.json();
    console.log('Dados recebidos:', { email, senha });

    //conecta ao banco de dados
    const { collection } = await connectToDatabase();

    //procura o usuário pelo email
    const user = await collection.findOne({ email });
    console.log('Usuário encontrado:', user);

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Usuário não encontrado.' }),
        { status: 404 }
      );
    }

    if (user.status !== 'aprovado') {
      return new Response(
        JSON.stringify({ message: 'Usuário ainda não aprovado.' }),
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Senha incorreta.' }),
        { status: 401 }
      );
    }

    //crietes a token from section
    if (!jwtSecret) {
      console.error('JWT_SECRET não está definido');
      return new Response(
        JSON.stringify({ message: 'Erro de configuração do servidor.' }),
        { status: 500 }
      );
    };
    
    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    //responde com sucesso, autenticação ok
    return new Response(
      JSON.stringify({
        message: 'Login bem-sucedido.',
        userName: user.nome,
        userEmail: user.email,
        token 
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
