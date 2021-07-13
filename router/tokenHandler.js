/**
 * Title: Token handler
 * Description: handle to all token related works
 * Author: Marzuk Zarir
 * Date: 13-07-2021
 *
 */

const handler = {}

handler.tokenHandler = (reqProperty, callback) => {
    // This reqMethods are allowed
    const allowedMethods = ['get', 'post', 'put', 'delete']

    // Check reqMethod is allowed. if not send status code 405(Method not allowed)
    if (allowedMethods.indexOf(reqProperty.reqMethod) > -1) {
        // Allowed reqMethod wise calling function and pass reqProp and callback
        handler._token[reqProperty.reqMethod](reqProperty, callback)
    } else {
        callback(405)
    }
}

// Private object
handler._token = {}

// Handle get token
handler._token.get = (reqProperty, callback) => {
    callback(200, { status: 'token route is fine' })
}

// Handle post token
handler._token.post = (reqProperty, callback) => {}

// Handle put/update token
handler._token.put = (reqProperty, callback) => {}

// Handle delete token
handler._token.delete = (reqProperty, callback) => {}

module.exports = handler.tokenHandler
