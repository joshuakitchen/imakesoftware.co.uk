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
  manifest.entries = manifest.entries
    .filter((item: any) => !item.hidden)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  setupLogging()

  const app = express()

  nunjucks.configure('templates', {
    autoescape: true,
    express: app,
  })

  morgan.token('remote-addr', function _remote(req: any) {
    if (req.headers['cf-connecting-ip']) {
      return req.headers['cf-connecting-ip']
    }
    return (
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
    )
  })

  morgan.token('headers', function _get(req: any) {
    return JSON.stringify(req.headers)
  })

  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :headers'
    )
  )

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
          manifest.entries.filter(
            (item: any) => parseInt(item.id) === post_id
          )[0].content
        ),
        'utf-8'
      )
      res.json({
        id: post_id,
        title: manifest.entries.filter(
          (item: any) => parseInt(item.id) === post_id
        ).title,
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
