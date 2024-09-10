
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

//caminho do arquivo JSON
const filePath = path.join(process.cwd(), 'src', 'data', 'users.json');

//ler os dados do arquivo JSON
const readData = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error);
    return [];
  }
};

//autenticação de usuário
export async function POST(req) {
  try {
    //extrai os dados da requisição
    const { email, senha } = await req.json();

    //lê os usuários existentes
    const users = readData();

    //procura o usuário pelo email
    const user = users.find((user) => user.email === email);

    if (!user) {
      //retorna erro se o usuário não existir
      return new Response(
        JSON.stringify({ message: 'Usuário não encontrado.' }),
        { status: 404 }
      );
    }

    if (user.status !== 'aprovado') {//verifica se o usuário foi aprovado
      return new Response(
        JSON.stringify({ message: 'Usuário ainda não aprovado.' }),
        { status: 403 }
      );
    }

    //compara a senha fornecida com a senha criptografada
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {  //retorna erro se a senha estiver incorreta   
      return new Response(
        JSON.stringify({ message: 'Senha incorreta.' }),
        { status: 401 }
      );
    }

    //responde com sucesso se a autenticação for ok
    return new Response(
        JSON.stringify({ 
            message: 'Login bem-sucedido.', 
            userName: user.nome 
        }), 
    { status: 200 } 
    );

  } catch (error) {
    console.error('Erro na requisição de login:', error);
    //retorna erro se houver falha
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }    
};  
 

  