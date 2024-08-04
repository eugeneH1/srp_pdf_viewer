import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { sql } from '@vercel/postgres';
import { randomBytes, createHmac } from "crypto";
import nodemailer from "nodemailer";

// Function to generate a random password
function generateRandomPassword(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
}

// Define SKU to Book ID mapping
const skuToBookId: Record<string, number> = {
    "DBv3_e": 3, // Digital Business Vol III
    "DBv2_e": 2, // Digital Business Vol II
    "DBv1_e": 1, // Digital Business Vol I
    "DBP_e": 4, // Digital Business Primer
    // Add more mappings as needed
};

const transporter = nodemailer.createTransport({
    host: 'mail.silkroutepress.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: false,
    debug: false,
});



export async function POST(request: Request) {

    try {
        // extract the body from the request
        const payload = await request.json();
        const { event } = payload;
        const { headers, body } = event;
        const { billing = {}, line_items = [] } = body;
        const { first_name, last_name, email } = billing;

        const secret = process.env.SRP_SECRET;
        if (!secret) {
            throw new Error('Secret not found in environment variables');
        }
        // console.log("Headers", headers);

        // // Retrieve the webhook signature from the headers
        const webhookSignature = headers['x-wc-webhook-signature'];
        if (!webhookSignature) {
            throw new Error('Webhook signature not found in headers');
        }

        // exit if not a pdf purchase
        for(const item of line_items) {
            if(item.sku.endsWith("_e")) {
                break;
            }
            return NextResponse.json({ message: "Not a PDF purchase" });
        }

        // Generate a random password
        const password = generateRandomPassword(10);
        const hashedPassword = await hash(password, 10);

        // start a transaction
        await sql`BEGIN`;

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
            INSERT INTO users (name, email, password, admin)
            VALUES (${first_name} || ' ' || ${last_name}, ${email}, ${hashedPassword}, FALSE)
            RETURNING id
            `;
            userId = userResponse.rows[0].id; // Get the user ID
            console.log(`User created with ID: ${userId}`);
        }
        console.log("User ID:", userId);

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
                await sql`ROLLBACK`;
                console.error("Error inserting sale", error);
                return NextResponse.json({ error: "Error inserting sale" }, { status: 500 });
            }
    }
    // mail customer login info
    try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Silk Route Press - Login Information",
          text: `Hello ${first_name} ${last_name},\n\nThank you for your purchase from Silk Route Press. \n\nYou can login to your account at https://srp-pdf-viewer.vercel.app/\n\nBest,\nSilk Route Press\nYour username is: ${email} and your password is: ${password}`,
        };
      
        const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent:", info);
      
      } catch (error) {
        await sql`ROLLBACK`;
        console.error("Error sending email", error);
        return NextResponse.json({ error: "Error sending email" }, { status: 500 });
      }
      
    
    // Insert into customers table
    try {
        const customerCheck = await sql`
        SELECT * FROM customers WHERE id = ${userId}
        `;
        if(customerCheck.rows.length > 0) {
            const existingBooks = customerCheck.rows[0].purchased_books;
            const updatedBooks = `{${existingBooks.join(',')},${purchased_books.join(',')}}`;
            
            await sql`
            UPDATE customers
            SET purchased_books = ${updatedBooks}
            WHERE id = ${userId}
            `;
        } else {
            // format purchased_books as an array
            const purchased_books_formatted = `{${purchased_books.join(',')}}`;

            // Insert into customers table
            await sql`
            INSERT INTO customers (id, name, email, purchased_books)
            VALUES (${userId}, ${first_name} || ' ' || ${last_name}, ${email}, ${purchased_books_formatted})
            `;
        }
        } catch (error) {
            await sql`ROLLBACK`;   
            console.error("Error inserting customer", error);
            return NextResponse.json({ error: "Error inserting customer" }, { status: 500 });
    }
        //commit the transaction
        await sql`COMMIT`;

      // Return the response
      return NextResponse.json({ message: "User and sales created", password });
    } catch (error) {
        await sql`ROLLBACK`;
        console.error("Error creating user, customer, or sales", error);
        return NextResponse.json({ error: "Error creating user, customer, or sales" }, { status: 500 });
    }
}
