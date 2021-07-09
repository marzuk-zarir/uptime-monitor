/**
 * Title: User handler
 * Description: handle to all user related works
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const { validatePostData } = require('../utils/validator')
const { hash } = require('../utils/utils')
const db = require('../lib/database')

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
user.get = (reqProperty, callback) => {
    callback(200)
}
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
user.put = (reqProperty, callback) => {}
user.delete = (reqProperty, callback) => {}

module.exports = handler
