import { MongoClient, ObjectId } from 'mongodb'; 
import { NextResponse } from 'next/server'; 

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI não está definida.'); 
};  

const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url); 
  const userId = searchParams.get("userId");  

  if (!userId) {  
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  };

  try {
    await client.connect();
    const db = client.db('BestFitData'); 
    const collection = db.collection('workouts'); 

    const workouts = await collection
      .find({ userId: new ObjectId(userId) }) 
      .project({
        description: 1,
        date: 1,
        exercises: 1,
        muscle: 1,
        level: 1,
        category: 1
      })
      .toArray();

    return NextResponse.json(workouts); 

  } catch (error) { 
    console.error('Failed to fetch workouts:', error);

    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );

  } finally {
    await client.close(); 
  }
};  
 



