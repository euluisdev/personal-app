import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

//configura a URL de conexão
const uri = process.env.MONGODB_URI || "mongodb+srv://fluisf00:<db_password>@cluster0.rw5mg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // substitua com sua string e mantenha senhas seguras.

//cria um novo cliente MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//conecta ao banco de dados
async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    //conecta ao banco de dados e coleção
    const db = client.db('bestFitData'); 
    const collection = db.collection('users');
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

//registra um novo usuário
export async function POST(req) {
  try {
    //extrair os dados da requisição
    const { nome, email, senha } = await req.json();

    //conecta ao banco de dados
    const { collection } = await connectToDatabase();

    //verifica se o usuário já está cadastrado pelo email
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Usuário já cadastrado.' }),
        { status: 400 }
      );
    }

    //criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = {
      nome,
      email,
      senha: hashedPassword,
      status: 'pendente',
      createdAt: new Date(), //data de criação
    };

    //adiciona novo usuário a coleção no bd
    await collection.insertOne(newUser);

    return new Response(
      JSON.stringify({ message: 'Cadastro enviado para aprovação.' }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na requisição de cadastro:', error);
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
};

