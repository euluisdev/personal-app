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

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
      await client.connect();
      const db = client.db('BestFitData');
      const collection = db.collection('workouts');

      const objectId = new ObjectId(userId);

      const workout = await collection.find({
        userId: objectId 
      }).sort({ 
        date: -1 
      }).toArray();

/*       const workoutHistory = workout.map(workout => {
        return { 
          id: workout._id,
          description: workout.description,
          date: workout.date,
          exercises: workout.exercises,
          muscleGroups: workout.muscleGroups,
          workoutStatus: workout.workoutStatus,
        };
      });

      console.log(workoutHistory); */

      return NextResponse.json(workout, { status: 200 }); 
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao buscar histórico de treinos' }, { status: 500 });
    
    } finally {
      await client.close();
    };
};
