/**
 * Title: Sample handler
 * Description: sample handler to check url
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const handler = {}

handler.sampleHandler = (reqProperty, callback) => {
    console.log(reqProperty)
    callback(200, {
        message: 'I am sample handler'
    })
}

module.exports = handler
