import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
    // create user and hash password
    try {
        const { name, email, password } = await request.json();
        // console.log({name, email, password});
        const hashedPassword = await hash(password, 10);

        const response = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        `;
    } catch(e) {
        console.log({e});
    }

    return NextResponse.json({message: "User created"});
}