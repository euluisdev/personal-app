import { NextResponse } from "next/server"; 

export async function GET() {
    return new NextResponse(null, {
        headers: {
            'Set-Cookie': `authToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`, 
        }, 
        status: 200, 
    });
}; 

