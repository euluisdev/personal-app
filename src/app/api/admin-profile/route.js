import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri);

async function connectToDatabase() {
    await client.connect();
    return client.db('BestFitData');
}

function validateFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
}

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
}

export async function PUT(req) {
    try {
        const db = await connectToDatabase();
        
        const formData = await req.formData();
        console.log([...formData.entries()]);
        
        const updateData = {};
        if (formData.has('nome')) updateData.nome = formData.get('nome');
        if (formData.has('email')) updateData.email = formData.get('email');
        if (formData.has('bio')) updateData.bio = formData.get('bio');

        const file = formData.get('photoUrl');
        console.log(`Eu sou ${file}`);
        if (file && file instanceof File) {
            if (!validateFileType(file)) {
                return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 });
            }

            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(process.cwd(), 'public/uploads', fileName);

            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            updateData.photoUrl = `/uploads/${fileName}`;
            /* console.log(updateData.photoUrl); */
        }

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
}

