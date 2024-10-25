
import { NextResponse } from 'next/server'; 
import { MongoClient } from 'mongodb';
import { Buffer } from 'buffer'; 
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';  
import { cookies } from 'next/headers';

const uri = process.env.MONGODB_URI; 
if (!uri) {
    throw new Error('MongoDB URI não está definida.');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const client = new MongoClient(uri); 
    
async function connectToDatabase() {
    await client.connect();
    return client.db('BestFitData');
}

function validateFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
};

async function verifyToken(req) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return null;
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
 
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return null;
    };
};

export async function GET(req) {
    try {
        const userData = await verifyToken(req);
 
        if (!userData || !userData.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 }); 
        }; 

        const db = await connectToDatabase(); 
        const collection = db.collection('users'); 

        const profile = await collection.findOne({
            email: userData.email
        });

        if (!profile) {
            return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
        }; 

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Erro no servidor:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    };
};


export async function PUT(req) {
    try {
        const userData = await verifyToken(req);

        if (!userData || !userData.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        };

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

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: `student_profile_${Date.now()}`
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            updateData.photoUrl = uploadResult.secure_url;
        };

        const result = await db.collection('users').updateOne(
            { email: userData.email },
            { $set: updateData }
        );

        const updatedProfile = await db.collection('users').findOne({
            email: userData.email
        });

        return NextResponse.json({
            message: 'Perfil atualizado com sucesso',
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    };
}; 

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
};   
 
 
 
