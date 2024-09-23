
import { MongoClient, ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

const uri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('BestFitData');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function GET() {
  try {
    const token = cookies().get('authToken')?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: 'Não autenticado' }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Token inválido ou expirado' }), { status: 401 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('users');

    const user = await collection.findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Usuário não encontrado' }), { status: 404 });
    }

    return new Response(JSON.stringify({
      name: user.nome || 'Nome não encontrado',
      email: user.email || 'Email não encontrado'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
  }
}
