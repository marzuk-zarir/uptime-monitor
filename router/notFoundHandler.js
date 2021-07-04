/**
 * Title: Not found handler
 * Description: 404 not found handler
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const handler = {}

handler.notFoundHandler = (reqProperty, callback) => {
    callback(404, {
        message: 'Error: url not found'
    })
}

module.exports = handler
