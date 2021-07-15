/**
 * Title: Validation Check
 * Description: Check validation for required fields
 * Author: Marzuk Zarir
 * Date: 07-07-2021
 *
 */

const validator = {}

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

// Validate put data
validator.validatePutData = ({ firstName, lastName, phone, password }) => {
    firstName = validator._isValidName(firstName)
    lastName = validator._isValidName(lastName)
    phone = validator._isValidPhone(phone)
    password = validator._isValidPassword(password)

    return { firstName, lastName, phone, password }
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
validator._isValidToken = (token, length = 20, type = 'string') => {
    return typeof token === type && token?.trim()?.length === length ? token?.trim() : false
}

module.exports = validator
