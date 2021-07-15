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
    _isValidPassword: validatePass,
    _isValidToken: validateToken
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
    const tokenId = validateToken(reqProperty.queryStrings.id)

    // If provided queryString's id field is valid, we read '.db/token/{reqBody}.json' file
    if (tokenId) {
        db.readData('token', tokenId, (readErr, tokenData) => {
            // Read data is json formate but we need to response object
            const tokenObj = { ...parsedJSON(tokenData) }
            // If err not happen we response tokenObj object
            if (!readErr && tokenObj) {
                callback(200, tokenObj)
            } else {
                callback(404, { status: 'Token is not found' })
            }
        })
    } else {
        callback(400, { status: 'Invalid token id' })
    }
}

// Handle post token
handler._token.post = (reqProperty, callback) => {
    const phone = validatePhone(reqProperty.body.phone)
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
                callback(404, { status: 'User not found' })
            }
        })
    } else {
        callback(400, { status: 'Password or phone is not valid' })
    }
}

// Handle put/update token
handler._token.put = (reqProperty, callback) => {
    const tokenId = validateToken(reqProperty.body.id)
    const extend = typeof reqProperty.body.extend === 'boolean' ? true : false

    // If requestBody is valid we read '.db/token/{tokenId}.json' file
    if (tokenId && extend) {
        db.readData('token', tokenId, (readErr, readData) => {
            const tokenData = { ...parsedJSON(readData) }
            if (!readErr && tokenData) {
                if (tokenData.expire > Date.now()) {
                    // Extend token for 30 minutes
                    tokenData.expire = Date.now() + 30 * 60 * 1000
                    // Store updated expire time
                    db.updateData('token', tokenId, tokenData, (upErr, upStatus) => {
                        if (!upErr && upStatus) {
                            callback(200, {
                                status: 'Token is successfully extended for 30 minutes from now'
                            })
                        } else {
                            callback(500, { status: "Couldn't extend expire time" })
                        }
                    })
                } else {
                    callback(400, { status: 'Token already expire' })
                }
            } else {
                callback(404, { status: 'Token is not found' })
            }
        })
    } else {
        callback(400, { status: 'There is a problem in your request' })
    }
}

// Handle delete token
handler._token.delete = (reqProperty, callback) => {
    const tokenId = validateToken(reqProperty.queryStrings.id)

    // If provided queryString's id field is valid, we read '.db/token/{tokenId}.json' file
    if (tokenId) {
        db.readData('token', tokenId, (readErr, readData) => {
            if (!readErr && readData) {
                db.deleteFile('token', tokenId, (delErr, delStatus) => {
                    if (!delErr && delStatus) {
                        callback(200, { status: 'Token is deleted successfully' })
                    } else {
                        callback(500, { status: "Couldn't delete Token" })
                    }
                })
            } else {
                callback(404, { status: 'Token is not found' })
            }
        })
    } else {
        callback(400, { status: 'There was a problem in your request' })
    }
}

module.exports = handler.tokenHandler
