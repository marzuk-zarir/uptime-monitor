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
        console.log(e.message)
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

// Generate a uniq token as provided length
utils.generateToken = (tokenLength) => {
    let length = typeof tokenLength === 'number' && tokenLength > 0 ? tokenLength : false
    if (length) {
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let token = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.round(Math.random() * possibleChar.length)
            token += possibleChar.charAt(randomIndex)
        }
        return token
    }
    return false
}

module.exports = utils
