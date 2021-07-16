/**
 * Title: Check handler
 * Description: handle to all check related works
 * Author: Marzuk Zarir
 * Date: 16-07-2021
 *
 */

const { hash, parsedJSON } = require('../utils/utils')
const { verifyToken } = require('../utils/verifyToken')
const db = require('../lib/database')
const {
    validateUserData,
    _isValidPhone: validatePhone,
    validatePutData,
    _isValidToken: validateToken
} = require('../utils/validator')

const handler = {}

handler.checkHandler = (reqProperty, callback) => {
    // This reqMethods are allowed
    const allowedMethods = ['get', 'post', 'put', 'delete']

    // Check reqMethod is allowed. if not send status code 405(Method not allowed)
    if (allowedMethods.indexOf(reqProperty.reqMethod) > -1) {
        // Allowed reqMethod wise calling function and pass reqProp and callback
        handler._check[reqProperty.reqMethod](reqProperty, callback)
    } else {
        callback(405)
    }
}

// Private object
handler._check = {}

handler._check.get = (reqProperty, callback) => {
    callback(200)
}

handler._check.post = (reqProperty, callback) => {}

handler._check.put = (reqProperty, callback) => {}

handler._check.delete = (reqProperty, callback) => {}

module.exports = handler.checkHandler
