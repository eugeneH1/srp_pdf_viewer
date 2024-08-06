import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
	const authCookie = cookies().get('auth_token');
	// console.log("authCookie in api: ", authCookie);
	if (authCookie) {
		try {
			const parsedCookie = JSON.parse(authCookie.value);
			const email = parsedCookie.email;
			const response = await sql`
				SELECT purchased_books FROM customers WHERE email = ${email}`;
			const purchasedBooks = response.rows[0].purchased_books || [];
			// console.log("purchased books: ", purchasedBooks);
			return NextResponse.json({ purchasedBooks });
		} catch (error) {
			console.error("Error fetching purchased books:", error);
			return NextResponse.json({ error: "Failed to fetch purchased books" }, { status: 500 });
		}
	} else {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}