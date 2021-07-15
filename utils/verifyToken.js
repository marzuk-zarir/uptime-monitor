/**
 * Title: Verify Token
 * Description: verify token for authentication
 * Author: Marzuk Zarir
 * Date: 15-07-2021
 *
 */

const db = require('../lib/database')
const { parsedJSON } = require('./utils')

const handler = {}

handler.verifyToken = (phone, tokenId, callback) => {
    db.readData('token', tokenId, (readErr, readData) => {
        const tokenData = parsedJSON(readData)

        if (!readErr && readData) {
            if (tokenData.phone === phone && tokenData.expire > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

module.exports = handler
