import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function seedAdmin() {
  try {
    console.log('Creating admin user...')

    // Check if admin exists
    const admin = await sql`SELECT id FROM users WHERE email = 'admin@example.com'`

    if (admin.length > 0) {
      console.log('Admin user already exists!')
      return
    }

    // Create admin user
    await sql`
      INSERT INTO users (auth0_id, email, name, role, password, is_active)
      VALUES (
        'auth0|admin',
        'admin@example.com',
        'Administrador',
        'admin',
        'admin123',
        true
      )
    `

    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    console.log('\nManager user created:')
    console.log('Email: manager@example.com')
    console.log('Password: manager123')
    console.log('\nSales person user created:')
    console.log('Email: sales@example.com')
    console.log('Password: sales123')
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
