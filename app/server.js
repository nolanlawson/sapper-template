import sirv from 'sirv'
import express from 'express'
import sapper from 'sapper'
import compression from 'compression'
import { manifest } from './manifest/server.js'
import helmet from 'helmet'
import uuidv4 from 'uuid/v4'

const {PORT, NODE_ENV} = process.env
const dev = NODE_ENV === 'development'

const app = express()

app.use(compression({threshold: 0}))
app.use(sirv('assets', {dev}))
app.use(function (req, res, next) {
	res.locals.nonce = uuidv4()
	next()
})
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			scriptSrc: [
				'\'self\'',
				(req, res) => `'nonce-${res.locals.nonce}'`
			]
		}
	}
}))
app.use(sapper({manifest}))
app.listen(PORT)
