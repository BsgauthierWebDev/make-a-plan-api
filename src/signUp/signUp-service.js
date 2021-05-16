const bcrypt = require('bcryptjs');
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/

const SignUpService = {
    hasUserWithUsername(db, username) {
        return db('users')
            .where({username})
            .first()
            .then(user => !!user)
    },
    validateUsername(username) {
        return false
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