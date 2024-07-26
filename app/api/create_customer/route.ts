import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from '@vercel/postgres';
import { randomBytes } from "crypto";

// Function to generate a random password
function generateRandomPassword(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
}

// Define SKU to Book ID mapping
const skuToBookId: Record<string, number> = {
    "DBv3_e-w": 3, // Digital Business Vol III
    "DBv2_e-w": 2, // Digital Business Vol II
    "DBv1_e-w": 1, // Digital Business Vol I
    // Add more mappings as needed
};

export async function POST(request: Request) {

    try {
        // extract the body from the request
        const payload = await request.json();
        const { event } = payload;
        const { body } = event;

        const { billing = {}, line_items = [] } = body;
        const { first_name, last_name, email } = billing;

        // Generate a random password
        const password = generateRandomPassword(10);
        const hashedPassword = await hash(password, 10);

        // check to see if user exists
        const userCheck = await sql`
        SELECT * FROM users WHERE email = ${email}
        `;

        let userId;
        if (userCheck.rows.length > 0) {
            userId = userCheck.rows[0].id; // Get the user ID
            console.log(`User already exists with ID: ${userId}`);
        } else {
            // Insert user into the users table
            const userResponse = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${first_name} || ' ' || ${last_name}, ${email}, ${hashedPassword})
            RETURNING id
            `;
            const userId = userResponse.rows[0].id; // Get the user ID
            console.log(`User created with ID: ${userId}`);
        }

        let purchased_books = [];
        // Extract purchased books and insert into sales table
        for (const item of line_items) {
            const bookId = skuToBookId[item.sku];
            const salePrice = parseFloat(item.subtotal);
            const eugeneValue = salePrice - salePrice * 0.95 * 0.95;
            purchased_books.push(bookId);

            // insert into sales table
            try{
                await sql`
                INSERT INTO sales (user_id, book_id, sale_price, eugene)
                VALUES (${userId}, ${bookId}, ${salePrice}, ${eugeneValue})
                `;
            } catch (error) {
                console.error("Error inserting sale", error);
                return NextResponse.json({ error: "Error inserting sale" }, { status: 500 });
            }
    }
    
    // Insert into customers table
    try {
        // format purchased_books as an array
        const purchased_books_formatted = `{${purchased_books.join(',')}}`;

        // Insert into customers table
        await sql`
        INSERT INTO customers (id, name, email, purchased_books)
        VALUES (${userId}, ${first_name} || ' ' || ${last_name}, ${email}, ${purchased_books_formatted})
        `;
    } catch (error) {
        console.error("Error inserting customer", error);
        return NextResponse.json({ error: "Error inserting customer" }, { status: 500 });
    }


      // Return the response
      return NextResponse.json({ message: "User and sales created", password });
    } catch (error) {
        console.error("Error creating user, customer, or sales", error);
        return NextResponse.json({ error: "Error creating user, customer, or sales" }, { status: 500 });
    }
}
