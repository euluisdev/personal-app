import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MongoDB URI não está definida.');
};  

const client = new MongoClient(uri);

export async function POST(req) {
  try {
    await client.connect();
    const db = client.db('BestFitData');
    const usersCollection = db.collection('users');
    const workoutsCollection = db.collection('workouts');

    const { userId, workoutData } = await req.json();

    if (!userId || !workoutData) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }; 

    //checks if user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(userId), status: 'aprovado' });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado ou não aprovado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //create workout
    const result = await workoutsCollection.insertOne({
        userId: new ObjectId(userId),
        ...workoutData,
        createdAt: new Date()
      });   
      console.log('Treino criado com sucesso:', result);

    return new Response(JSON.stringify({ message: 'Treino criado com sucesso', workoutId: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar treino:', error);
    return new Response(JSON.stringify({ error: 'Erro ao criar treino' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } finally {
    await client.close();
  };
};

