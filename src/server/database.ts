import ObjectId from 'bson-objectid'
import { Client } from 'pg'
import winston from 'winston'

let database: Client

export function id() {
  return ObjectId().toHexString()
}

export async function setupDatabase() {
  if (!database) {
    winston.error('unable to setup database, object did not exist')
    return
  }
  await database.query(
    'CREATE TABLE IF NOT EXISTS posts (id VARCHAR(24) NOT NULL PRIMARY KEY, date_created TIMESTAMP DEFAULT NOW(), last_edited TIMESTAMP DEFAULT NOW(), title VARCHAR(60) NOT NULL, content TEXT NOT NULL, in_progress BOOLEAN DEFAULT TRUE)'
  )
}

export function useDatabase() {
  if (!database) {
    database = new Client(process.env.DATABASE_URL)
  }
  return database
}
