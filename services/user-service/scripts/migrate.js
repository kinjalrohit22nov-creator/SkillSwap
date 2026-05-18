const { Client } = require('pg')
require('dotenv').config()

const DDL = `
-- Enable UUID and Vector Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR,
  name VARCHAR,
  university VARCHAR,
  bio TEXT,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE,
  category VARCHAR,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Skills mapping table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR,
  is_teaching BOOLEAN,
  CONSTRAINT unique_user_skill UNIQUE(user_id, skill_id)
);

-- Create Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR,
  tokens_cost INTEGER,
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 48,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR,
  amount INTEGER,
  description VARCHAR,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  stripe_event_id VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

async function runMigration() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set in environment.')
    process.exit(1)
  }

  console.log('Connecting to Supabase PostgreSQL database...')
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('Connected successfully! Starting DDL migration...')
    await client.query(DDL)
    console.log('Database tables constructed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
