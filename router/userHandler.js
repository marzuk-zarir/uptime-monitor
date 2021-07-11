/**
 * Title: User handler
 * Description: handle to all user related works
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const { hash, parsedJSON } = require('../utils/utils')
const db = require('../lib/database')
const {
    validateUserData,
    _isValidPhone: validatePhone,
    validatePutData
} = require('../utils/validator')

const handler = {}

handler.userHandler = (reqProperty, callback) => {
    // This reqMethods are allowed
    const allowedMethods = ['get', 'post', 'put', 'delete']

    // Check reqMethod is allowed. if not send status code 405(Method not allowed)
    if (allowedMethods.indexOf(reqProperty.reqMethod) > -1) {
        // Allowed reqMethod wise calling function and pass reqProp and callback
        user[reqProperty.reqMethod](reqProperty, callback)
    } else {
        callback(405)
    }
}

// We declare new object with reqMethod wise func for encapsulation
const user = {}

// Handle get request
user.get = (reqProperty, callback) => {
    const phone = validatePhone(reqProperty.queryStrings.phone, 'string', 11)

    // If provided queryString's phone field is valid, we read '.db/user/{reqBody}.json' file
    if (phone) {
        db.readData('user', phone, (readErr, data) => {
            // Read data is json formate but we need to response object
            const user = { ...parsedJSON(data) }
            // We don't want to access 'password' field in get req. so, we delete pass field
            delete user.password

            // If err not happen we response user object
            if (!readErr && user) {
                callback(200, user)
            } else {
                callback(500, { status: "Couldn't read data" })
            }
        })
    } else {
        callback(404, { status: 'User not found' })
    }
}

// Handle post request
user.post = (reqProperty, callback) => {
    const isValid = validateUserData(reqProperty.body)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (isValid) {
        db.readData('user', isValid.phone, (readErr, readData) => {
            if (readErr) {
                // If not we create a user in '.db/user' folder
                isValid.password = hash(isValid.password)
                db.createData('user', isValid.phone, isValid, (CrtErr, status) => {
                    if (CrtErr) callback(500, { status: "Couldn't create user" })
                    else callback(200, { status: 'User created successfully' })
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

// Handle put/update request
user.put = (reqProperty, callback) => {
    const { firstName, lastName, phone, password } = validatePutData(reqProperty.body)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (phone) {
        db.readData('user', phone, (readErr, data) => {
            // Parse json into js obj
            const userData = { ...parsedJSON(data) }

            // If read file is empty we throw client error
            if (!readErr && userData) {
                // If valid user info not provide in reqBody throw client error
                if (firstName || lastName || password) {
                    if (firstName) userData.firstName = firstName
                    if (lastName) userData.lastName = lastName
                    if (password) userData.password = password

                    // If valid user info provide in reqBody send success msg. otherwise throw server error
                    db.updateData('user', phone, userData, (putErr, status) => {
                        if (!putErr && status) {
                            callback(200, { status: 'User information updated successfully' })
                        } else {
                            callback(500, { status: "Couldn't update user info" })
                        }
                    })
                } else {
                    callback(400, { status: 'Field should follow the requirements' })
                }
            } else {
                callback(400, { status: 'User info not found' })
            }
        })
    } else {
        callback(400, { status: 'Invalid Phone field' })
    }
}

// Handle delete request
user.delete = (reqProperty, callback) => {}

module.exports = handler
