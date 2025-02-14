import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri);

export async function POST(req) {
  try {
    await client.connect();
    const db = client.db('BestFitData');
    const workoutsCollection = db.collection('workouts');

    const { workoutId, status } = await req.json();

    if (!workoutId || !status) {
      return NextResponse.json({ message: 'Parâmetros inválidos' }, { status: 400 });
    }

    const updatedWorkout = await workoutsCollection.findOneAndUpdate(
      { _id: new ObjectId(workoutId) },
      { $set: { workoutStatus: status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updatedWorkout) {
      return NextResponse.json({ message: 'Treino não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status atualizado com sucesso', workout: updatedWorkout }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o status do treino:', error);
    return NextResponse.json({ message: 'Erro no servidor ao atualizar o status' }, { status: 500 });
  } finally {
    await client.close();
  };  
};  
 
 
