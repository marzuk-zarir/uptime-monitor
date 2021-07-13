/**
 * Title: Routes
 * Description: Application routes
 * Author: Marzuk Zarir
 * Date: 04-07-2021
 *
 */

const userHandler = require('./userHandler')
const tokenHandler = require('./tokenHandler')

const routes = {
    user: userHandler,
    token: tokenHandler
}

module.exports = routes
