const { db } = require('@vercel/postgres');
const {
  customers,
  users,
} = require('../app/scripts/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        username VARCHAR(255) UNIQUE
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const lowerCaseEmail = user.email.toLowerCase();
        const baseUsername = user.name.replace(/\s+/g, '_').toLowerCase();
        return client.sql`
        WITH name_parts AS (
          SELECT
            '${user.id}' AS id,
            '${user.name}' AS name,
            '${lowerCaseEmail}' AS email,
            '${hashedPassword}' AS password,
            '${baseUsername}' AS base_username
        ),
        duplicates AS (
          SELECT
            id,
            base_username,
            ROW_NUMBER() OVER (PARTITION BY base_username ORDER BY id) AS rn
          FROM name_parts
        )
        INSERT INTO users (id, name, email, password, username)
        SELECT
          id,
          name,
          email,
          password,
          CASE 
            WHEN rn = 1 THEN base_username
            ELSE base_username || '_' || (rn - 1)
          END
        FROM duplicates
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        purchased_books INTEGER[] NOT NULL,
        username VARCHAR(255) UNIQUE
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map((customer) => {
        const lowerCaseEmail = customer.email.toLowerCase();
        const baseUsername = customer.name.replace(/\s+/g, '_').toLowerCase();
        return client.sql`
        WITH name_parts AS (
          SELECT
            '${customer.id}' AS id,
            '${customer.name}' AS name,
            '${lowerCaseEmail}' AS email,
            ARRAY[${customer.purchased_books}]::INTEGER[] AS purchased_books,
            '${baseUsername}' AS base_username
        ),
        duplicates AS (
          SELECT
            id,
            base_username,
            ROW_NUMBER() OVER (PARTITION BY base_username ORDER BY id) AS rn
          FROM name_parts
        )
        INSERT INTO customers (id, name, email, purchased_books, username)
        SELECT
          id,
          name,
          email,
          purchased_books,
          CASE 
            WHEN rn = 1 THEN base_username
            ELSE base_username || '_' || (rn - 1)
          END
        FROM duplicates
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
