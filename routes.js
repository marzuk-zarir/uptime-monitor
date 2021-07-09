/**
 * Title: Routes
 * Description: Application routes
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const { sampleHandler } = require('./router/sampleHandler')
const { userHandler } = require('./router/userHandler')

const routes = {
    sample: sampleHandler,
    user: userHandler
}

module.exports = routes
