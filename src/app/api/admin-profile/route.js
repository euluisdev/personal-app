import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    return client.db('BestFitData');
};


//GET req
export async function GET(req) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const profile = await collection.findOne({ role: 'admin' });
        console.log(profile);

        if (!profile) {
            return new Response(JSON.stringify({ error: 'Perfil não encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(profile), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Erro no servidor:', error);
        return new Response(JSON.stringify({ error: 'Erro no servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

//PUT req
export async function PUT(req) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { photoUrl, nome, email, bio } = await req.json();

        const updatedProfile = await collection.findOneAndUpdate(
            { role: 'admin' },
            { $set: { photoUrl, nome, email, bio } },
            { returnDocument: 'after' }
        );

        if (!updatedProfile) {
            return new Response(JSON.stringify({ error: 'Perfil não encontrado para atualização' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Perfil atualizado', profile: updatedProfile }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return new Response(JSON.stringify({ error: 'Erro no servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    };
}


