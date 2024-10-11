import { MongoClient } from "mongodb"; 
import { ObjectId } from 'mongodb';
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri);

export async function GET(req, res) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    console.log('userId: ' + userId);

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
      await client.connect();
      const db = client.db('BestFitData');
      const collection = db.collection('workouts');

      const oneWeekAgo = new Date();

      console.log(oneWeekAgo);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const workouts = await collection.find({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        date: { $gte: oneWeekAgo }
      }).sort({ date: 1 }).toArray();

      console.log(workouts);

      const workoutHistory = [
        'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
      ].map(day => {
        const workout = workouts.find(w => new Date(w.date).getDay() === ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].indexOf(day));
        return {
          day,
          workout: workout ? 'Concluído' : 'Não realizado'
        };
      });

      return NextResponse.json({workoutHistory}, { status: 200 }); 
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao buscar histórico de treinos' }, { status: 500 });
    } finally {
      await client.close();
    }      
};
