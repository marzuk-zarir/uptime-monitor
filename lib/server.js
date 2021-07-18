/**
 * Title: Server
 * Description: All server related funcs
 * Author: Marzuk Zarir
 * Date: 03-07-2021
 *
 */

const http = require('http')
const env = require('../.env/env')
const { handleReqRes } = require('../helper/handleReqRes')

// Server object
const server = {}

// Create a server
server.createServer = () => {
    const createServer = http.createServer(handleReqRes)
    createServer.listen(env.port, () => {
        console.log(`Application is running on ${env.env} environment`)
        console.log(`Server is running on http://localhost:${env.port}`)
    })
}

// Start Server
server.init = () => {
    server.createServer()
}

module.exports = server
