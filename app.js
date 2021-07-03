const http = require('http')

// Main object
const app = {}

// Configuration
app.config = {
    port: 3000
}

// Create a server
app.createServer = () => {
    const server = http.createServer(app.handleServer)
    server.listen(app.config.port, () => {
        console.log(`Server is running on http://localhost:${app.config.port}`)
    })
}

// Handle server
app.handleServer = (req, res) => {
    res.end('Server is fine')
}

// Start Server
app.createServer()
