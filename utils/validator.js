/**
 * Title: Validation Check
 * Description: Check validation for required fields
 * Author: Marzuk Zarir
 * Date: 07-07-2021
 *
 */

const validator = {}

validator.validatePostData = ({ firstName, lastName, phone, password, termsAgree }) => {
    firstName = validator._isValidName(firstName, 'string')
    lastName = validator._isValidName(lastName, 'string')
    phone = validator._isValidPhone(phone, 'string', 11)
    password = validator._isValidPassword(password)
    termsAgree = typeof termsAgree === 'boolean' ? termsAgree : false

    // If every fields return true we return validated object
    if (firstName && lastName && phone && password) {
        return { firstName, lastName, phone, password, termsAgree }
    }

    return false
}

/**
 * ! Utility function for this file
 * * function contains 'optional chaining' feature which is introduced in es11 in js
 * * bcz if a field is missing in object app is will crash. that's why we use optional chaining
 */

// Check is name trimmed length is greater than 0 and less than 10 character
validator._isValidName = (nameField, type) => {
    nameField = nameField?.trim()
    if (typeof nameField === type && nameField?.length > 0 && nameField?.length <= 10) {
        return nameField
    }
    return false
}

// Check is phone number trimmed length is greater than provided length
validator._isValidPhone = (phoneField, type, phoneLength) => {
    return typeof phoneField === type && phoneField?.trim()?.length === phoneLength
        ? phoneField?.trim()
        : false
}

// Check is password length is greater than 8 character
validator._isValidPassword = (passwordField) => {
    return typeof passwordField === 'string' && passwordField?.length >= 8 ? passwordField : false
}

module.exports = validator
