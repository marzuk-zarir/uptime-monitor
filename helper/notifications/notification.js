/**
 * Title: Notification
 * Description: All notification related functions
 * Author: Marzuk Zarir
 * Date: 18-07-2021
 *
 */

const https = require('https')
const { twilio } = require('../../.env/env')
const { validateSms } = require('../../utils/validator')

const notification = {}

// Send twilio SMS
notification.sendSms = (phoneNumber, message, callback) => {
    const { phone, msg: msgBody } = validateSms(phoneNumber, message)

    if (phone && msgBody) {
        // Create SMS object and stringify this
        const messageObj = JSON.stringify({
            From: twilio.fromPhone,
            To: `+88${phone}`,
            Body: msgBody
        })

        // Api Request details
        const reqDetails = {
            hostname: 'api.twilio.com',
            method: 'GET',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        // Initialize request object
        const req = https.request(reqDetails, (res) => {
            const status = res.statusCode
            if (status === 200 || status === 201) {
                callback(false)
            } else {
                callback(`Error ${status}: ☹ Message not send!`)
            }
        })

        // Send error (network or other issues) object in callback if error happen
        req.on('error', (e) => callback(e))

        // Send request
        req.write(messageObj)
        req.end()
    } else {
        callback('Phone or message was messing or invalid!')
    }
}

module.exports = notification
