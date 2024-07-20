import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
	const session = await getServerSession();
	if (session) {
		const email = session.user?.email;
        console.log("Email: ", email);
		try {
			const response = await sql`
				SELECT purchased_books FROM customers WHERE email = ${email}`;
			const purchasedBooks = response.rows[0].purchased_books;
			return NextResponse.json({ purchasedBooks });
		} catch (error) {
			console.error("Error fetching purchased books:", error);
			return NextResponse.json({ error: "Failed to fetch purchased books" }, { status: 500 });
		}
	} else {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}