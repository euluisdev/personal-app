import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Configurar a URL de conexão (use a variável de ambiente para a URL do MongoDB)
const uri = process.env.MONGODB_URI || "mongodb+srv://fluisf00:<db_password>@cluster0.rw5mg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // substitua com sua string e mantenha senhas seguras.

// Criar um novo cliente MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Função para conectar ao banco de dados
async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    // Conectar ao banco de dados e coleção que deseja usar
    const db = client.db('nomedobanco'); // substitua 'nomedobanco' pelo nome do seu banco
    const collection = db.collection('usuarios'); // substitua 'usuarios' pelo nome da coleção desejada
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

// Função para registrar um novo usuário
export async function POST(req) {
  try {
    // Extrair os dados da requisição
    const { nome, email, senha } = await req.json();

    // Conectar ao banco de dados
    const { collection } = await connectToDatabase();

    // Verificar se o usuário já está cadastrado pelo email
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Usuário já cadastrado.' }),
        { status: 400 }
      );
    }

    // Criptografar a senha do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = {
      nome,
      email,
      senha: hashedPassword,
      status: 'pendente',
      createdAt: new Date(), // Data de criação
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

