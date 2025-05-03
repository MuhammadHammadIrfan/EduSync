// test-connection.js
require('dotenv').config(); // Load env file

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => {
    console.log('✅ Connected to Supabase');
    return client.end();
  })
  .catch((err) => console.error('❌ Connection failed:', err));
