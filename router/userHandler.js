/**
 * Title: User handler
 * Description: handle to all user related works
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const { validatePostData } = require('../utils/validator')
const { hash, parsedJSON } = require('../utils/utils')
const db = require('../lib/database')
const { _isValidPhone: checkPhone } = require('../utils/validator')

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
    const phone = checkPhone(reqProperty.queryStrings.phone, 'string', 11)

    // If provided queryString's phone field is valid, we read '.db/user/{reqBody}.json' file
    if (phone) {
        db.readData('user', phone, (err, data) => {
            // Read data is json formate but we need to response object
            const user = { ...parsedJSON(data) }
            // We don't want to access 'password' field in get req. so, we delete pass field
            delete user.password

            // If err not happen we response user object
            if (!err && user) {
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
    const isValid = validatePostData(reqProperty.body)

    // If requestBody is valid we read '.db/user/{reqBody.phone}.json' file
    if (isValid) {
        db.readData('user', isValid.phone, (err, readData) => {
            if (err) {
                // If not we create a user in '.db/user' folder
                isValid.password = hash(isValid.password)
                db.createData('user', isValid.phone, isValid, (err, status) => {
                    if (err) callback(500, { status: "Couldn't create user" })
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

// Handle put request
user.put = (reqProperty, callback) => {}

// Handle delete request
user.delete = (reqProperty, callback) => {}

module.exports = handler
