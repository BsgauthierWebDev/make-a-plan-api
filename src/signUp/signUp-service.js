const bcrypt = require('bcryptjs');
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/
// const REGEX_USERNAME = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

const SignUpService = {
    hasUserWithUsername(db, username) {
        return db('users')
            .where({username})
            .first()
            .then(user => !!user)
    },
    validateUsername(username) {
        return false
        // if (!REGEX_USERNAME.test(username)) {
        //     return `Please ender a valid username`
        // }
        // return null
    },
    insertUser(db, newUser) {
        return db  
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return `Password must be 8 or more characters`
        }
        if (password.length > 32) {
            return `Password must be less than 32 characters`
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return `Password must not start or end with empty spaces`
        }
        if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
            return `Password must contain one uppercase letter, one lowercase letter and one number`
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            email: xss(user.email),
            username: xss(user.username),
            date_created: new Date(user.date_created),
        }
    },
}

module.exports = SignUpService