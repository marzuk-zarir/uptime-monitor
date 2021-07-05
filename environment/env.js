/**
 * Title: Environment variables
 * Description: all environment related func
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const env = {}

// Development environment
env.development = {
    port: 3000,
    env: 'development'
}

// Production environment
env.production = {
    port: 6000,
    env: 'production'
}

// Grab which environment user pass to run this app (default: 'development')
const givenEnv =
    typeof process.env.NODE_ENV === 'string'
        ? process.env.NODE_ENV
        : 'development'

// Select specific object for given environment
const selectedEnvObj =
    typeof env[givenEnv] === 'object' ? env[givenEnv] : env.development

module.exports = selectedEnvObj
