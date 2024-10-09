import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

import { v2 as cloudinary } from 'cloudinary';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MongoDB URI não está definida.');
};

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET  
});

const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    return client.db('BestFitData');
};

function validateFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
};

export async function GET() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const profile = await collection.findOne({ role: 'admin' });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
        }

        return NextResponse.json(profile);

    } catch (error) {
        console.error('Erro no servidor:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}; 

export async function PUT(req) {
    try {
        const db = await connectToDatabase();
        const formData = await req.formData();
        
        const updateData = {};
        if (formData.has('nome')) updateData.nome = formData.get('nome');
        if (formData.has('email')) updateData.email = formData.get('email');
        if (formData.has('bio')) updateData.bio = formData.get('bio');

        const file = formData.get('photoUrl');
        if (file && file instanceof File) {
            if (!validateFileType(file)) {
                return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 });
            };

            const uploadResult = await cloudinary.uploader.upload(file.stream(), {
                public_id: `user_profile_${Date.now()}`, 
                resource_type: 'image' 
            });

            updateData.photoUrl = uploadResult.secure_url;
        };

        const result = await db.collection('users').updateOne(
            { role: 'admin' },
            { $set: updateData }
        );

/*         if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Perfil não encontrado ou nenhuma alteração foi feita' }, { status: 404 });
        } */

        const updatedProfile = await db.collection('users').findOne({ role: 'admin' });

        return NextResponse.json({ message: 'Perfil atualizado com sucesso', profile: updatedProfile });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
};  

