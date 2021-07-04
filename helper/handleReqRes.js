/**
 * Title: Handle Request Response
 * Description: Process request and response for main server
 * Author: Marzuk Zarir
 * Date: 4-7-21
 *
 */

const url = require('url')
const { StringDecoder } = require('string_decoder')

const handler = {}

handler.handleReqRes = (req, res) => {
    const decoder = new StringDecoder('utf-8')
    const reqHeader = req.headers
    const reqMethod = req.method.toLowerCase()
    const parsedUrl = url.parse(req.url, true)
    const queryStrings = parsedUrl.query
    let pathname = parsedUrl.pathname
    pathname = pathname.replace(/^\/|\/$/g, '')
    let fullData = ''

    // Request body as received as buffer
    req.on('data', (bufferChunk) => {
        fullData += decoder.write(bufferChunk)
    })

    // When stream complete this event fire
    req.on('end', () => {
        fullData += decoder.end()
        console.log(fullData)
        res.end('Server is running...😎😎😎')
    })
}

module.exports = handler
