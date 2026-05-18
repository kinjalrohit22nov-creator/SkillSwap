const { Client } = require('pg')
require('dotenv').config()

const SKILLS = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'Machine Learning', category: 'Data Science' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Docker', category: 'DevOps' }
]

async function runSeed() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set in environment.')
    process.exit(1)
  }

  console.log('Connecting to Supabase PostgreSQL database for seeding...')
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('Connected! Seeding default skills...')

    // Generate a mock 1536-dimensional embedding vector (array of zeros)
    const mockVector = '[' + Array(1536).fill(0).join(',') + ']'

    for (const skill of SKILLS) {
      await client.query(
        \`INSERT INTO skills (name, category, embedding) 
         VALUES ($1, $2, $3::vector) 
         ON CONFLICT (name) DO NOTHING\`,
        [skill.name, skill.category, mockVector]
      )
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runSeed()
