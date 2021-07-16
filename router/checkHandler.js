/**
 * Title: Check handler
 * Description: handle to all check related works
 * Author: Marzuk Zarir
 * Date: 16-07-2021
 *
 */

const db = require('../lib/database')
const { maxChecks } = require('../.env/env')
const { parsedJSON, generateString } = require('../utils/utils')
const { verifyToken } = require('../utils/verifyToken')
const { validateCheckData, validateToken, validateCheck } = require('../utils/validator')

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
    const checkId = validateCheck(reqProperty.queryStrings.check)
    const tokenId = validateToken(reqProperty.reqHeader.token)

    if (checkId) {
        db.readData('check', checkId, (readErr, readData) => {
            const checkData = parsedJSON(readData)
            verifyToken(checkData?.phone, tokenId, (isAuth) => {
                if (isAuth) {
                    if (!readErr && checkData) {
                        callback(200, checkData)
                    } else {
                        callback(404, { status: 'Check not found' })
                    }
                } else {
                    callback(403, { status: 'Authentication failed' })
                }
            })
        })
    } else {
        callback(400, { status: 'There was a problem in your request' })
    }
}

// Create checks ( authentication needed )
handler._check.post = (reqProperty, callback) => {
    const checkData = validateCheckData(reqProperty.body)
    const tokenId = isValidToken(reqProperty.reqHeader.token)

    if (checkData) {
        db.readData('token', tokenId, (tReadErr, tokenData) => {
            if (!tReadErr && tokenData) {
                const phone = parsedJSON(tokenData).phone
                verifyToken(phone, tokenId, (isValid) => {
                    if (isValid) {
                        db.readData('user', phone, (uReadErr, uData) => {
                            if (!uReadErr && uData) {
                                let userData = parsedJSON(uData)
                                let userChecks = userData.checks ? userData.checks : []

                                if (userChecks.length <= maxChecks) {
                                    const checkId = generateString(20)
                                    const { protocol, url, method, successCode, timeout } =
                                        checkData
                                    const checkObj = {
                                        checkId,
                                        phone,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeout
                                    }
                                    // Create check in '.db/check/{checkId}.json' folder
                                    db.createData('check', checkId, checkObj, (cErr, cStatus) => {
                                        if (!cErr && cStatus) {
                                            // Update checks in '.db/user/{phone}.json' folder
                                            userData.checks = userChecks
                                            userData.checks.push(checkId)
                                            db.updateData(
                                                'user',
                                                phone,
                                                userData,
                                                (uErr, uStatus) => {
                                                    if (!uErr && uStatus) {
                                                        callback(200, checkObj)
                                                    } else {
                                                        callback(500, {
                                                            status: "Couldn't create checkId in users"
                                                        })
                                                    }
                                                }
                                            )
                                        } else {
                                            callback(500, { status: "Couldn't create check" })
                                        }
                                    })
                                } else {
                                    callback(429, {
                                        status: 'User has already reached maximum checks limit'
                                    })
                                }
                            } else {
                                callback(500, { status: "Couldn't access user" })
                            }
                        })
                    } else {
                        // Token exist but expire
                        callback(403, { status: 'Authentication failed' })
                    }
                })
            } else {
                // Token not exist
                callback(403, { status: 'Authentication failed' })
            }
        })
    } else {
        callback(400, { status: 'There was a problem in your request' })
    }
}

handler._check.put = (reqProperty, callback) => {}

handler._check.delete = (reqProperty, callback) => {}

module.exports = handler.checkHandler
