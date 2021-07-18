/**
 * Title: Uptime Monitoring Api
 * Description:
 * Author: Marzuk Zarir
 * Date: 03-07-2021
 *
 */

const server = require('./lib/server')
const worker = require('./lib/worker')

// Main object
const app = {}

// Initialize the main function
app.init = () => {
    // Start the server
    server.init()

    // Start the worker
    worker.init()
}

// Start the program
app.init()
