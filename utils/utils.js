/**
 * Title: Utilities
 * Description: All utilities helper func
 * Author: Marzuk Zarir
 * Date: 07-07-2021
 *
 */

const crypto = require('crypto')
const env = require('../.env/env')

const utils = {}

// This method prevent to crash app if client send invalid js obj
utils.parsedJSON = (jsonData) => {
    let data
    try {
        data = JSON.parse(jsonData)
    } catch (e) {
        data = {}
    } finally {
        return data
    }
}

// Hashing a string
utils.hash = (strData) => {
    if (typeof strData === 'string' && strData.length > 0) {
        return crypto.createHmac('sha256', env.secretKey).update(strData).digest('hex')
    }

    return false
}

// Generate a uniq string as provided length
utils.generateString = (stringLength) => {
    let length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false
    if (length) {
        const possibleChar =
            '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let string = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * possibleChar.length)
            string += possibleChar.charAt(randomIndex)
        }
        return string
    }
    return false
}

utils.updateCheckField = (checkObj, fieldObject) => {
    if (typeof fieldObject === 'object' && !Array.isArray(fieldObject)) {
        for (let field in checkObj) {
            if (fieldObject[field]) {
                checkObj[field] = fieldObject[field]
            }
        }
    } else {
        return false
    }
}

module.exports = utils
