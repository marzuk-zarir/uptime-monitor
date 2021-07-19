/**
 * Title: Service worker
 * Description: All worker related funcs
 * Author: Marzuk Zarir
 * Date: 18-07-2021
 *
 */

const http = require('http')
const https = require('https')
const url = require('url')
const chalk = require('chalk')

const db = require('./database')
const { parsedJSON } = require('../utils/utils')
const { validateState, validateLastCheck } = require('../utils/validator')
const { sendSms } = require('../helper/notifications/notification')

// Worker object
const worker = {}

// Gather all checks form '.db/check' folder
worker.gatherAllChecks = () => {
    // List all checks files
    db.listFiles('check', (listErr, checksArray) => {
        if (!listErr && checksArray && checksArray.length > 0) {
            // Read every check data
            checksArray.forEach((check) => {
                db.readData('check', check, (readErr, readData) => {
                    if (!readErr && readData) {
                        // Pass each check data object for validation
                        worker.validateCheckData(parsedJSON(readData))
                    } else {
                        console.log(
                            chalk.bold.red('Error: when read a single file form check directory')
                        )
                    }
                })
            })
        } else {
            console.log(chalk.bold.red(listErr))
        }
    })
}

// Validate single check object data
worker.validateCheckData = (checkData) => {
    if (checkData && checkData.checkId) {
        checkData.state = validateState(checkData.state)
        checkData.lastCheck = validateLastCheck(checkData.lastCheck)
        // Pass checkData for send check request
        worker.checkRequest(checkData)
    } else {
        console.log(chalk.bold.red('Error: check data is invalid'))
    }
}

// Send request to check url
worker.checkRequest = (checkData) => {
    const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true)

    // Set request config
    const reqDetails = {
        protocol: `${checkData.protocol}:`,
        hostname: parsedUrl.hostname,
        method: checkData.method.toUpperCase(),
        path: parsedUrl.path,
        timeout: checkData.timeout * 1000
    }

    // Set which method used in request
    const setProtocol = checkData.protocol === 'https' ? https : http

    // Temp variable for prevent multiple function call
    let checkResponse = { error: false, status: '', statusCode: false }
    let isOutcome = false

    const req = setProtocol.request(reqDetails, (res) => {
        checkResponse.statusCode = res.statusCode
        checkResponse.status = 'Fetch successfully'

        // Make sure that already response came
        if (!isOutcome) {
            worker.saveOutcome(checkData, checkResponse)
            isOutcome = true
        }
    })

    // If error event emit
    req.on('error', (e) => {
        checkResponse.error = true
        checkResponse.status = e.message

        // Make sure that already response came
        if (!isOutcome) {
            worker.saveOutcome(checkData, checkResponse)
            isOutcome = true
        }
    })

    // If timeout event emit
    req.on('timeout', () => {
        checkResponse.error = true
        checkResponse.status = 'Request timeout'

        // Make sure that already response came
        if (!isOutcome) {
            worker.saveOutcome(checkData, checkResponse)
            isOutcome = true
        }
    })

    // Send request
    req.end()
}

// Save outcome in database
worker.saveOutcome = (checkData, { error, status, statusCode }) => {
    const state =
        !error && statusCode && checkData.successCode.indexOf(statusCode) > -1 ? 'up' : 'down'
    const isAlertWant = checkData.lastCheck && checkData.state !== state ? true : false

    // Update lastCheck & state
    checkData.state = state
    checkData.lastCheck = Date.now()

    // Save in database
    db.updateData('check', checkData.checkId, checkData, (upErr, upStatus) => {
        if (!upErr && upStatus) {
            // If state change send sms to the user
            if (isAlertWant) {
                worker.sendAlertToUser(checkData)
            } else {
                console.log(chalk.green('Alert is not needed. There is no state change'))
            }
        } else {
            console.log(
                chalk.bold.red("Error: Couldn't update lastCheck and state for single check file")
            )
        }
    })
}

// Send alert to user with SMS for state change
worker.sendAlertToUser = (checkData) => {
    const message = `Alert: Your check for ${checkData.method.toUpperCase()} ${
        checkData.protocol
    }://${checkData.url} is currently ${checkData.state}.`

    sendSms(checkData.phone, message, (err) => {
        if (!err) {
            console.log(chalk.bold.blue(`User is alert with via SMS - ${message}`))
        } else {
            console.log(chalk.bold.red("Error: Couldn't send SMS to the user"))
        }
    })
}

// Start Worker
worker.init = () => {
    // Call gatherAllChecks first time
    worker.gatherAllChecks()
    // Continue call gatherAllChecks after 3 seconds
    setInterval(() => worker.gatherAllChecks(), 3000)
}

module.exports = worker
