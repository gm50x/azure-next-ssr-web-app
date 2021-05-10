const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

const app = next({ dev })
const nextHandler = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    server.get('*', (req, res) => nextHandler(req, res))

    server.listen(port, err => {
        if (err) {
            throw err
        }

        console.log(`> Ready on Port ${port}`)
    })
})