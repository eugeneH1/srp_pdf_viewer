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
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const lowerCaseEmail = user.email.toLowerCase();
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${lowerCaseEmail}, ${hashedPassword})
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
        purchased_books INTEGER[] NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map((customer) => {
        const lowerCaseEmail = customer.email.toLowerCase();
        return client.sql`
        INSERT INTO customers (id, name, email, purchased_books)
        VALUES (${customer.id}, ${customer.name}, ${lowerCaseEmail}, ${customer.purchased_books})
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

async function seedUsernames(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    const insertUsernames = await Promise.all(
      client.sql`
        -- Step 1: Add the new column
        ALTER TABLE users ADD COLUMN username VARCHAR(255);

        -- Step 2: Update the new column with concatenated names
        WITH name_parts AS (
            SELECT 
                id, 
                name, 
                array_to_string(array_remove(string_to_array(name, ' '), ''), '_') AS base_username
            FROM users
        ), 
        duplicates AS (
            SELECT 
                id, 
                base_username, 
                row_number() OVER (PARTITION BY base_username ORDER BY id) AS rn
            FROM name_parts
        )
        UPDATE users
        SET username = CASE 
            WHEN rn = 1 THEN base_username
            ELSE base_username || '_' || rn - 1
        END
        FROM duplicates
        WHERE users.id = duplicates.id;

        -- Step 3: Ensure the new username column is unique
        ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);

      `
    );
  } catch (error) {
    console.error('Error seeding usernames:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedUsernames(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});