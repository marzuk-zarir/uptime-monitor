/**
 * Title: Uptime Monitoring Api
 * Description:
 * Author: Marzuk Zarir
 * Date: 03-07-2021
 *
 */

const http = require('http')
const env = require('./environment/env')
const { handleReqRes } = require('./helper/handleReqRes')

// Main object
const app = {}

// Create a server
app.createServer = () => {
    const server = http.createServer(handleReqRes)
    server.listen(env.port, () => {
        console.log(`Application is running on ${env.env} environment`)
        console.log(`Server is running on http://localhost:${env.port}`)
    })
}

// Start Server
app.createServer()
