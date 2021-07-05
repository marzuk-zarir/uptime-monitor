/**
 * Title: Handle Request Response
 * Description: Process request and response for main server
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const url = require('url')
const { StringDecoder } = require('string_decoder')

// Routes handler
const routes = require('../routes')
const { notFoundHandler } = require('../router/notFoundHandler')

const handler = {}

handler.handleReqRes = (req, res) => {
    const reqHeader = req.headers
    const reqMethod = req.method.toLowerCase()
    const parsedUrl = url.parse(req.url, true)
    const queryStrings = parsedUrl.query
    let pathname = parsedUrl.pathname
    pathname = pathname.replace(/^\/|\/$/g, '')

    const decoder = new StringDecoder('utf-8')
    let fullData = ''

    // Choose handler as requested route
    const selectHandler = routes[pathname] ? routes[pathname] : notFoundHandler
    const requestObject = { reqHeader, reqMethod, pathname, queryStrings }

    // Request body as received as buffer
    req.on('data', (bufferChunk) => {
        fullData += decoder.write(bufferChunk)
    })

    // When stream complete this event fire
    req.on('end', () => {
        fullData += decoder.end()

        // This callback call from routes
        selectHandler(requestObject, (statusCode, reqBody) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500
            reqBody = typeof reqBody === 'object' ? reqBody : {}

            // Convert object as a string
            const body = JSON.stringify(reqBody)

            // Send response to client
            res.writeHead(statusCode)
            res.end(body)
        })
    })
}

module.exports = handler
