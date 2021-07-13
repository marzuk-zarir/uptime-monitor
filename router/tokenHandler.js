/**
 * Title: Token handler
 * Description: handle to all token related works
 * Author: Marzuk Zarir
 * Date: 13-07-2021
 *
 */

const db = require('../lib/database')
const { parsedJSON, generateToken, hash } = require('../utils/utils')
const {
    _isValidPhone: validatePhone,
    _isValidPassword: validatePass
} = require('../utils/validator')

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
handler._token.post = (reqProperty, callback) => {
    const phone = validatePhone(reqProperty.body.phone, 'string')
    const password = validatePass(reqProperty.body.password)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (phone && password) {
        db.readData('user', phone, (readErr, readData) => {
            // ReqBody password convert to hash
            const hashedPassword = hash(password)
            // If server read user data from file
            if (!readErr && readData) {
                // If reqBody hash password match with stored hash password
                if (hashedPassword === parsedJSON(readData).password) {
                    const token = generateToken(20)
                    const expire = Date.now() + 60 * 60 * 1000
                    const tokenObject = { id: token, expire, phone }
                    // We response a unique token and store this token in '.db/token/{token}.json' file
                    // And every token has a expire date
                    // This token is use for user sign in to site
                    db.createData('token', token, tokenObject, (crtErr, crtStatus) => {
                        if (!crtErr && crtStatus) callback(200, tokenObject)
                        else callback(500, { status: "Couldn't access token" })
                    })
                } else {
                    callback(400, { status: "Password doesn't match" })
                }
            } else {
                callback(500, { status: "Couldn't access user" })
            }
        })
    } else {
        callback(400, { status: 'Password or phone is not valid' })
    }
}

// Handle put/update token
handler._token.put = (reqProperty, callback) => {}

// Handle delete token
handler._token.delete = (reqProperty, callback) => {}

module.exports = handler.tokenHandler
