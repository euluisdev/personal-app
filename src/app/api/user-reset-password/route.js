import { NextResponse } from "next/server"; 
import { hash } from 'bcryptjs'; 
import { MongoClient } from "mongodb"; 

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MongoDB URI não está definida.');
}

const client = new MongoClient(uri);

export async function POST(req) {
    const { token, senha } = await req.json(); 

    try {
        await client.connect(); 
        const db = client.db('BestFitData');  
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ resetToken: token });

        if (!user) {
            return NextResponse.json({ message: 'Token inválido ou não encontrado.' }, { status: 400 });
        };

        const currentTime = new Date();
        if (user.resetTokenExpiry < currentTime) {
            return NextResponse.json({ message: 'Token expirado.' }, { status: 400 });
        }

        const hashedPassword = await hash(senha, 10);

        await usersCollection.updateOne(
            { _id: user._id }, 
            { 
                $set: { senha: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiry: "" }
            }
        );

        return NextResponse.json({ message: 'Senha redefinida com sucesso.' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        return NextResponse.json({ message: 'Erro ao atualizar a senha.' }, { status: 500 });

    } finally {
        await client.close(); 
    }; 
}; 


 
 