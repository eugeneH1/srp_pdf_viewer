import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from '@vercel/postgres'


export async function POST(request: Request) {
    // create user and hash password
    try {
        // TODO: validate request body
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

    // create customer and allocate purchase book
    try{
        const { name, email, purchased_books } = await request.json();
        // check to see if single book or array of books
        const purchasedBooksArray = Array.isArray(purchased_books) ? purchased_books : [purchased_books];

        const purchasedBooksArrayFormatted = `array[${purchasedBooksArray.join(', ')}]`;

        const response = await sql`
        INSERT INTO customers (name, email, purchased_books)
        VALUES (${name}, ${email}, ${purchasedBooksArray as any} 
        `
    } catch (error) {
        console.error("Error creating customer", error);
    }

    return NextResponse.json({message: "User created"});
}