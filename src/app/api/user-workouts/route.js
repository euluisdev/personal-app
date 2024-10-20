import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

let client;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Verificar se o userId é válido como ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db('BestFitData');
    const collection = db.collection('workouts');

    // Converter o userId para ObjectId
    const objectId = new ObjectId(userId);

    // Buscar workouts do usuário específico
    const workouts = await collection
      .find({ userId: objectId })
      .sort({ date: 1 }) // Ordenar por data do treino (pode ser ajustado)
      .toArray();

    if (!workouts || workouts.length === 0) {
      return NextResponse.json({ message: 'Nenhum treino encontrado' }, { status: 404 });
    }

    console.log('Workouts encontrados:', workouts);
    
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Failed to fetch workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts', details: error.message },
      { status: 500 }
    );
  }
}



