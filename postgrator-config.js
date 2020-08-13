require('dotenv').config();

module.exports = {
     "migrationDirectory": "migrations",
     "driver": "pg",
     "connectionString": (process.env.NODE_ENV === 'test')
          ? process.env.TEST_DATABASE_URL
          : process.env.DATABASE_URL,
}

// psql -U postgres -d noteful2 -f./src/seeds/seed.noteful.sql

