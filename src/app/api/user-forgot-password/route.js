import { NextResponse } from "next/server"; 
import nodemailer from "nodemailer"; 
import crypto from "crypto";  
import { Collection, MongoClient } from "mongodb"; 

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

        const resetToken = crypto.randomBytes(32).toString('hex');  
        const resetTokenExpiry = new Date(Date.now() + 3600000);  

        await usersCollection.updateOne(
            { email }, 
            {
              $set: { resetToken, resetTokenExpiry }  
            }, 
        );

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Password Reset Request',
            html: `
              <h1>Password Reset Request</h1>
              <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">
                Reset Password
              </a>
            `,
          });

        return NextResponse.json(
          { message: 'Um link de redefinição de senha foi enviado para seu email.' },
          { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred while processing your request.', error },
            { status: 500 }
        ); 
    };
};   


