import express from 'express'
import morgan from 'morgan'
import { AddressInfo, Server } from 'net'
import path from 'path'
import winston from 'winston'
import nunjucks from 'nunjucks'
import fs from 'fs/promises'

function setupLogging() {
  winston.configure({
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  })
}

async function main() {
  const manifest = JSON.parse(
    await fs.readFile(
      path.resolve(process.cwd(), 'posts', 'manifest.json'),
      'utf-8'
    )
  )
  manifest.entries = manifest.entries.map((entry: any, idx: number) => ({
    ...entry,
    id: `${idx + 1}`,
  }))
  setupLogging()

  const app = express()

  nunjucks.configure('templates', {
    autoescape: true,
    express: app,
  })

  app.use(morgan('common'))

  app.use('/static', express.static(path.resolve(process.cwd(), 'static')))

  app.get('/api/posts/:post_id/', async function (req, res, next) {
    try {
      const post_id = parseInt(req.params.post_id)
      if (post_id <= 0 || post_id > manifest.entries.length) {
        res.status(404).json({
          name: 'not_found',
          message: 'The resource you are looking for could not be found.',
        })
        return
      }
      const content = await fs.readFile(
        path.resolve(
          process.cwd(),
          'posts',
          manifest.entries[post_id - 1].content
        ),
        'utf-8'
      )
      res.json({
        id: post_id,
        title: manifest.entries[post_id - 1].title,
        content: content,
      })
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/posts/', function (req, res) {
    res.json({
      data: manifest.entries.map((item: any) => ({
        id: item.id,
        title: item.title,
      })),
    })
  })

  app.get('/*', function _getIndex(req, res) {
    res.render('index.html', {
      dev: process.env.NODE_ENV === 'dev',
    })
  })

  app.listen(8080, function _onListen(this: Server) {
    winston.info(
      `application has started on ${(this.address() as AddressInfo).port}`
    )
  })
}

main().catch(function _onStartupError(err: Error) {
  throw err
})
