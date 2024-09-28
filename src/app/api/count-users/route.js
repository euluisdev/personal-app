import { MongoClient } from "mongodb"; 

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MongoDB URI não está definida.');
};

const client = new MongoClient(uri); 

export async function GET() {
    try {
      await client.connect();
      const db = client.db('BestFitData');
      const collection = db.collection('users');

      const countUsers = await collection.countDocuments({ status: 'aprovado' });
      return new Response(JSON.stringify({ cont: countUsers }), { status: 200 });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao contar usuários' }, { status: 500 }));  
    };
};