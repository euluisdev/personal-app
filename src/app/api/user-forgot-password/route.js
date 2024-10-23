import { NextResponse } from "next/server"; 
import nodemailer from "nodemailer"; 
import crypto from "crypto";  
import { MongoClient } from "mongodb"; 

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MongoDB URI não está definida.');
};

const client = new MongoClient(uri);

export async function POST (req) {
    try {
        await client.connect(); 
        const db = client.db('BestFitData');  
        const usersCollection = db.collection('users'); 

        const { email } = await req.json(); 

        const user = await usersCollection.findOne({ email }); 

        if (!user) {
            return NextResponse.json(
              { message: 'If this email exists, a reset link will be sent.' },
              { status: 200 }
            );
        };  

    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred while processing your request.' },
            { status: 500 }
        ); 
    };
};   


