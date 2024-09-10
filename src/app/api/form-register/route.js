// src/app/api/form-register/route.js
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

//caminho do arquivo json
const filePath = path.join(process.cwd(), 'src', 'data', 'users.json');

//lê e salva os dados do arquivo json com tratamento de erros
const readData = () => {
  try {
    //lê o arquivo json e retorna os dados
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error);
    //retorna um array vazio se ocorrer erro na leitura
    return [];
  }
};

const saveData = (data) => {
  try {
    //escreve os dados atualizados no arquivo json
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    //captura erro para ser tratado na função chamadora
    throw new Error('Falha ao salvar os dados');
  }
};

//registro de novo usuário
export async function POST(req) {
  try {
    //extrai os dados da requisição
    const { nome, email, senha } = await req.json();

    //lê os dados existentes
    let users = readData();

    //verifica se o usuário já está cadastrado pelo email
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      // Responde com erro se o usuário já existir
      return new Response(
        JSON.stringify({ message: 'Usuário já cadastrado.' }),
        { status: 400 }
      );
    }

    //criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = {
      id: Date.now(),
      nome,
      email,
      senha: hashedPassword,
      status: 'pendente',
    };

    //add o novo usuário à lista
    users.push(newUser);

    //tenta salvar os dados e responde com sucesso se não houver erro
    saveData(users);
    return new Response(
      JSON.stringify({ message: 'Cadastro enviado para aprovação.' }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na requisição de cadastro:', error);
    //erro em caso de falha
    return new Response(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
};
