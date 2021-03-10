// validation module

function validateUsername(username) {
    if (username.length < 3 || username.length > 32) return false
    // check for profanity etc later
    return true
}

function validateName(name) {
    if (name.length < 1 || name.length > 32) return false
    return true
}

function validateEmail(email) {
    if (email.length == 0) return false
    // regex pattern from https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
    if (
        !email.match(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        )
    ) {
        return false
    }
    return true
}

function validatePassword(pass) {
    if (pass.length < 6 || pass.length > 32) return false
    return true
}

module.exports = {
    validateUsername,
    validatePassword,
    validateName,
    validateEmail
}
