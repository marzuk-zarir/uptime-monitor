/**
 * Title: Routes
 * Description: Application routes
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const userHandler = require('./userHandler')
const tokenHandler = require('./tokenHandler')
const checkHandler = require('./checkHandler')

const routes = {
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
}

module.exports = routes
