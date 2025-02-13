import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short', 
    hour: '2-digit',
    minute: '2-digit',
  });
};

export async function GET(req) {
  try {
    await client.connect();
    
    const db = client.db('BestFitData');
    
    //Join 
    const workouts = await db.collection('workouts').aggregate([
      {
        $match: { workoutStatus: 'Pago' } 
      },
      {
        $sort: { updatedAt: -1 }  
      },
      {
        $limit: 10  
      },
      {
        $lookup: {
          from: 'users',  
          localField: 'userId',  
          foreignField: '_id',  
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'  
      },
      {
        $project: {
          _id: 0,
          workoutStatus: 1,
          updatedAt: 1,
          'userInfo.nome': 1  
        }
      }
    ]).toArray();

    const responseData = workouts.map((workout) => ({
      userName: workout.userInfo.nome,
      workoutStatus: workout.workoutStatus,
      updatedAt: formatDate(workout.updatedAt),
    }));

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar treinos pagos:', error);
    return new Response('Erro interno no servidor', { status: 500 });
  }
};


