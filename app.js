/**
 * Title: Uptime Monitoring Api
 * Description:
 * Author: Marzuk Zarir
 * Date: 03-07-2021
 *
 */

const http = require('http')
const { handleReqRes } = require('./helper/handleReqRes')

// Main object
const app = {}

// Configuration
app.config = {
    port: 3000
}

// Create a server
app.createServer = () => {
    const server = http.createServer(handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Server is running on http://localhost:${app.config.port}`)
    })
}

// Start Server
app.createServer()
