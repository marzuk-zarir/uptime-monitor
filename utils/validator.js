/**
 * Title: Validation Check
 * Description: Check validation for required fields
 * Author: Marzuk Zarir
 * Date: 07-07-2021
 *
 */

const validator = {}

// Validate user data ( 'post' request method )
validator.validateUserData = ({ firstName, lastName, phone, password, termsAgree }) => {
    firstName = validator._isValidName(firstName)
    lastName = validator._isValidName(lastName)
    phone = validator._isValidPhone(phone)
    password = validator._isValidPassword(password)
    termsAgree = typeof termsAgree === 'boolean' ? termsAgree : false

    // If every fields return true we return validated object
    if (firstName && lastName && phone && password) {
        return { firstName, lastName, phone, password, termsAgree }
    }

    return false
}

// Validate user data ( 'put' request method )
validator.validatePutData = ({ firstName, lastName, phone, password }) => {
    firstName = validator._isValidName(firstName)
    lastName = validator._isValidName(lastName)
    phone = validator._isValidPhone(phone)
    password = validator._isValidPassword(password)

    return { firstName, lastName, phone, password }
}

// Validate check data ( 'post' request method )
validator.validateCheckData = ({ protocol, url, method, successCode, timeout }) => {
    protocol = validator._check.protocol(protocol, ['http', 'https'])
    url = validator._check.url(url)
    method = validator._check.method(method)
    successCode = validator._check.successCodes(successCode)
    timeout = validator._check.timeout(timeout)

    if (protocol && url && method && successCode && timeout) {
        return { protocol, url, method, successCode, timeout }
    }

    return false
}

// Validate check data ( 'put' request method )
validator.validatePutCheck = ({ protocol, url, method, successCode, timeout }) => {
    protocol = validator._check.protocol(protocol, ['http', 'https'])
    url = validator._check.url(url)
    method = validator._check.method(method)
    successCode = validator._check.successCodes(successCode)
    timeout = validator._check.timeout(timeout)

    return { protocol, url, method, successCode, timeout }
}

/**
 * ! Utility function for this file
 * * function contains 'optional chaining' feature which is introduced in es11 in js
 * * bcz if a field is missing in object app is will crash. that's why we use optional chaining
 */

// Check is name trimmed length is greater than 0 and less than 10 character
validator._isValidName = (nameField, type = 'string') => {
    nameField = nameField?.trim()
    if (typeof nameField === type && nameField?.length > 0 && nameField?.length <= 10) {
        return nameField
    }
    return false
}

// Check is phone number trimmed length is greater than provided length
validator._isValidPhone = (phoneField, type = 'string', phoneLength = 11) => {
    return typeof phoneField === type && phoneField?.trim()?.length === phoneLength
        ? phoneField?.trim()
        : false
}

// Check is password length is greater than 8 character
validator._isValidPassword = (passwordField, type = 'string') => {
    return typeof passwordField === type && passwordField?.length >= 8 ? passwordField : false
}

// Check is auth token's length is similar with provided length
validator.validateToken = (token, length = 20, type = 'string') => {
    return typeof token === type && token?.trim()?.length === length ? token?.trim() : false
}

// Check is checkId's length is similar with provided length
validator.validateCheck = (check, length = 20, type = 'string') => {
    return typeof check === type && check?.trim()?.length === length ? check?.trim() : false
}

// ? Validate all check related property
validator._check = {}

// Validate protocol as allowedProtocol array
validator._check.protocol = (givenProtocol, allowedProtocols, type = 'string') => {
    const protocol =
        typeof givenProtocol === type && allowedProtocols?.indexOf(givenProtocol) > -1
            ? givenProtocol
            : false
    if (protocol) {
        return protocol
    }
    return false
}
// Validate url
validator._check.url = (url) => {
    url = typeof url === 'string' && url?.trim()?.length > 0 ? url?.trim() : false
    if (url) {
        return url
    }
    return false
}
// Validate method
validator._check.method = (givenMethod, type = 'string') => {
    const allowedMethods = ['get', 'post', 'put', 'delete']
    const method =
        typeof givenMethod === type && allowedMethods.indexOf(givenMethod) > -1
            ? givenMethod
            : false
    if (method) {
        return method
    }
    return false
}
// Validate successCode
validator._check.successCodes = (successCodes, type = 'object') => {
    const codes =
        typeof successCodes === type &&
        Array.isArray(successCodes) &&
        successCodes.every((code) => typeof code === 'number')
            ? successCodes
            : false
    if (codes) {
        return codes
    }
    return false
}
// Validate timeout (minimum timeout is 7 seconds)
validator._check.timeout = (timeoutSec, type = 'number') => {
    const timeout =
        typeof timeoutSec === type && timeoutSec > 0 && timeoutSec <= 7 ? timeoutSec : false
    if (timeout) {
        return timeout
    }
    return false
}

module.exports = validator
