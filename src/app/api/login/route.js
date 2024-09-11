import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// URL de conexão com o MongoDB (lembre-se de manter a senha segura, usando variáveis de ambiente)
const uri = process.env.MONGODB_URI || "mongodb+srv://fluisf00:<db_password>@cluster0.rw5mg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // substitua com sua string e mantenha senhas seguras.

//cria um novo cliente MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//conecta ao banco de dados
async function connectToDatabase() {
  try {
    if (!client.isConnected()) await client.connect();
    // Conectar ao banco de dados e coleção desejada
    const db = client.db('nomedobanco'); // substitua 'nomedobanco' pelo nome do seu banco
    const collection = db.collection('usuarios'); // substitua 'usuarios' pelo nome da coleção
    return { db, collection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

// Função para autenticar o usuário
export async function POST(req) {
  try {
    // Extrai os dados da requisição
    const { email, senha } = await req.json();

    // Conectar ao banco de dados
    const { collection } = await connectToDatabase();

    // Procura o usuário pelo email
    const user = await collection.findOne({ email });

    if (!user) {
      // Retorna erro se o usuário não existir
      return new Response(
        JSON.stringify({ message: 'Usuário não encontrado.' }),
        { status: 404 }
      );
    }

    // Verifica se o usuário foi aprovado
    if (user.status !== 'aprovado') {
      return new Response(
        JSON.stringify({ message: 'Usuário ainda não aprovado.' }),
        { status: 403 }
      );
    }

    // Compara a senha fornecida com a senha criptografada
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
      // Retorna erro se a senha estiver incorreta
      return new Response(
        JSON.stringify({ message: 'Senha incorreta.' }),
        { status: 401 }
      );
    }

    // Responde com sucesso se a autenticação for ok
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
    // Retorna erro se houver falha
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}


  