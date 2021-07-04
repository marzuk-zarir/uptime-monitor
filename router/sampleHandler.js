/**
 * Title: Sample route
 * Description: App route handler
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const handler = {}

handler.sampleHandler = (reqProperty, callback) => {
    console.log(reqProperty)
    callback(200, {
        message: 'hello world...i am from sample route'
    })
}

module.exports = handler
