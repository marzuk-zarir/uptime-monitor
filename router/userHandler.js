/**
 * Title: User handler
 * Description: handle to all user related works
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const { hash, parsedJSON } = require('../utils/utils')
const { verifyToken } = require('../utils/verifyToken')
const db = require('../lib/database')
const {
    validateUserData,
    _isValidPhone: validatePhone,
    validatePutData,
    validateToken
} = require('../utils/validator')

const handler = {}

handler.userHandler = (reqProperty, callback) => {
    // This reqMethods are allowed
    const allowedMethods = ['get', 'post', 'put', 'delete']

    // Check reqMethod is allowed. if not send status code 405(Method not allowed)
    if (allowedMethods.indexOf(reqProperty.reqMethod) > -1) {
        // Allowed reqMethod wise calling function and pass reqProp and callback
        handler._user[reqProperty.reqMethod](reqProperty, callback)
    } else {
        callback(405)
    }
}

// Private object
handler._user = {}

// Handle get request (authentication needed)
handler._user.get = (reqProperty, callback) => {
    const phone = validatePhone(reqProperty.queryStrings.phone)
    // Validate token which is send by client in request header
    const tokenId = validateToken(reqProperty.reqHeader.token)

    // If provided queryString's phone field is valid, we read '.db/user/{reqBody}.json' file
    if (phone) {
        verifyToken(phone, tokenId, (isTokenExist) => {
            db.readData('user', phone, (readErr, readData) => {
                if (!readErr && readData) {
                    if (isTokenExist) {
                        const user = { ...parsedJSON(readData) }
                        delete user.password
                        callback(200, user)
                    } else {
                        callback(403, { status: 'Authentication failed' })
                    }
                } else {
                    callback(404, { status: 'User not found' })
                }
            })
        })
    } else {
        callback(400, { status: 'There was problem in your request' })
    }
}

// Handle post request (not need authentication)
handler._user.post = (reqProperty, callback) => {
    const isValid = validateUserData(reqProperty.body)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (isValid) {
        db.readData('user', isValid.phone, (readErr, readData) => {
            if (readErr) {
                // If not we create a user in '.db/user' folder
                isValid.password = hash(isValid.password)
                db.createData('user', isValid.phone, isValid, (crtErr, crtStatus) => {
                    if (!crtErr && crtStatus) callback(200, { status: 'User created successfully' })
                    else callback(500, { status: "Couldn't create user" })
                })
            } else {
                // If read file successfully we send error that 'user is already exist'
                callback(502, { status: 'User is already exist' })
            }
        })
    } else {
        callback(400, { status: 'There is a problem in your request' })
    }
}

// Handle put/update request (authentication needed)
handler._user.put = (reqProperty, callback) => {
    const { firstName, lastName, phone, password } = validatePutData(reqProperty.body)
    const tokenId = validateToken(reqProperty.reqHeader.token)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (phone) {
        verifyToken(phone, tokenId, (isTokenExist) => {
            db.readData('user', phone, (readErr, readData) => {
                const userData = { ...parsedJSON(readData) }
                if (!readErr && userData) {
                    if (isTokenExist) {
                        // If valid user info not provide in reqBody throw client error
                        if (firstName || lastName || password) {
                            if (firstName) userData.firstName = firstName
                            if (lastName) userData.lastName = lastName
                            if (password) userData.password = hash(password)

                            // If valid user info provide in reqBody send success msg. otherwise throw server error
                            db.updateData('user', phone, userData, (putErr, putStatus) => {
                                if (!putErr && putStatus) {
                                    callback(200, {
                                        status: 'User information updated successfully'
                                    })
                                } else {
                                    callback(500, { status: "Couldn't update user info" })
                                }
                            })
                        } else {
                            callback(400, { status: 'Field should follow the requirements' })
                        }
                    } else {
                        callback(403, { status: 'Authentication failed' })
                    }
                } else {
                    callback(400, { status: 'There was problem in your request' })
                }
            })
        })
    } else {
        callback(400, { status: 'Invalid Phone field' })
    }
}

// Handle delete request (authentication needed)
handler._user.delete = (reqProperty, callback) => {
    const phone = validatePhone(reqProperty.queryStrings.phone)
    const tokenId = validateToken(reqProperty.reqHeader.token)

    // If provided queryString's phone field is valid, we read '.db/user/{reqBody}.json' file
    if (phone) {
        verifyToken(phone, tokenId, (isTokenExist) => {
            db.readData('user', phone, (readErr, readData) => {
                // If err not happen we delete file
                if (!readErr && readData) {
                    if (isTokenExist) {
                        // If err not happen we response status code 200
                        db.deleteFile('user', phone, (delErr, delStatus) => {
                            if (!delErr && delStatus) {
                                callback(200, { status: 'User is deleted successfully' })
                            } else {
                                callback(500, { status: "Couldn't delete user" })
                            }
                        })
                    } else {
                        callback(403, { status: 'Authentication failed' })
                    }
                } else {
                    callback(404, { status: 'User is not found' })
                }
            })
        })
    } else {
        callback(400, { status: 'There was a problem in your request' })
    }
}

module.exports = handler.userHandler
