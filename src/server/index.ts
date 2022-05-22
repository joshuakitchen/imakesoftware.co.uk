import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { AddressInfo, Server } from 'net'
import path from 'path'
import winston from 'winston'
import nunjucks from 'nunjucks'
import { setupDatabase, useDatabase } from './database'
import ObjectID from 'bson-objectid'

function setupLogging() {
  winston.configure({
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  })
}

async function main() {
  dotenv.config()
  setupLogging()

  const database = useDatabase()
  await database.connect()
  await setupDatabase()
  winston.info('application has connected to postgres')

  const app = express()

  nunjucks.configure('templates', {
    autoescape: true,
    express: app,
  })

  morgan.token('remote-addr', function _remote(req: any) {
    if (req.headers['do-connecting-ip']) {
      return req.headers['do-connecting-ip']
    }
    return (
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
    )
  })

  app.use(morgan('common'))
  app.use(cookieParser(process.env.SECRET_KEY))

  app.use('/static', express.static(path.resolve(process.cwd(), 'static')))

  app.get('/api/posts/:post_id/', async function (req, res, next) {
    try {
      const db = useDatabase()
      const { rows, rowCount } = await db.query<{
        id: string
        title: string
        content: string
      }>('SELECT id, title, content FROM posts WHERE id = $1::text', [
        req.params.post_id,
      ])

      if (rowCount === 0) {
        return res.status(404).json({
          name: 'not_found',
          message: 'The content you are looking for could not be found.',
        })
      }
      const [data] = rows
      res.json({
        id: data.id,
        title: data.title,
        content: data.content,
      })
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/posts/', bodyParser.json(), async function (req, res, next) {
    try {
      const { session } = req.signedCookies
      if (!session) {
        res.status(403).json({
          name: 'forbidden',
          message: 'You do not have permission to access that resource.',
        })
        return
      }
      const db = useDatabase()
      const id = ObjectID().toHexString()
      await db.query(
        'INSERT INTO posts (id, title, content, in_progress) VALUES ($1, $2, $3, false)',
        [id, req.body.title, req.body.content]
      )
      res.json({
        id: id,
        title: req.body.title,
        content: req.body.content,
      })
    } catch (err) {
      next(err)
    }
  })

  app.patch(
    '/api/posts/:post_id',
    bodyParser.json(),
    async function (req, res, next) {
      const { session } = req.signedCookies
      if (!session) {
        res.status(403).json({
          name: 'forbidden',
          message: 'You do not have permission to access that resource.',
        })
        return
      }
      const { post_id: id } = req.params
      const db = useDatabase()
      await db.query('UPDATE posts SET title=$2, content=$3 WHERE id = $1', [
        id,
        req.body.title,
        req.body.content,
      ])
      res.json({
        id: id,
        title: req.body.title,
        content: req.body.content,
      })
    }
  )

  app.get('/api/posts/', async function (req, res, next) {
    try {
      const db = useDatabase()
      const data = await db.query<{ id: string; title: string }>(
        'SELECT id, title, date_created FROM posts ORDER BY date_created DESC'
      )
      res.json({
        data: data.rows,
      })
    } catch (err) {
      next(err)
    }
  })

  app.post(
    '/login',
    bodyParser.json(),
    async function _onLogin(req, res, next) {
      try {
        const password = await bcrypt.compare(
          req.body.password,
          process.env.PASSWORD
        )
        if (req.body.email === process.env.EMAIL && password) {
          winston.info(`${req.body.email} has signed in successfully`)
          res.cookie('session', JSON.stringify({ email: req.body.email }), {
            signed: true,
            secure: true,
          })
          res.status(200).json({ success: true })
        } else {
          winston.warn(`${req.body.email} attempted to sign in`)
          res.status(401).json({
            name: 'invalid_credentials',
            message: 'The username or password is incorrect.',
          })
        }
      } catch (err) {
        next(err)
      }
    }
  )

  app.get('/*', function _getIndex(req, res) {
    res.render('index.html', {
      dev: process.env.NODE_ENV === 'dev',
      user: req.signedCookies.session
        ? Buffer.from(req.signedCookies.session).toString('base64')
        : null,
    })
  })

  app.listen(8080, function _onListen(this: Server) {
    winston.info(
      `application has started on ${(this.address() as AddressInfo).port}`
    )
  })
}

main().catch(function _onStartupError(err: Error) {
  winston.error(`error on starting the application: ${err.message}`)
  throw err
})
