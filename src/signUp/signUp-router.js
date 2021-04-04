const express = require('express');
const path = require('path');
const { hasUserWithUsername } = require('./signUp-service');
const SignUpService = require('./signUp-service');

const signUpRouter = express.Router()
const jsonBodyParser = express.json()

signUpRouter
    .post('/sign-up', jsonBodyParser, (req, res, next) => {
        const {email, username, password} = req.body

        for (const field of ['email', 'username', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: {message: `Missing '${field}' in request body`}
                })

            const passwordError = SignUpService.validatePassword(password)
            const usernameError = SignUpService.validateUsername(username)

            if (passwordError)
                return res.status(400).json({error: passwordError})
            if (usernameError)
                return res.status(400).json({error: usernameError})

                SignUpService.hasUserWithUsername(
                    req.app.get('db'),
                    username
            )
                    .then(hasUserWithUsername => {
                        if (hasUserWithUsername)
                            return res
                                .status(400)
                                .json({error: `Username already taken`})

                        return SignUpService.hashPassword(password)
                            .then(hashedPassword => {
                                const newUser = {
                                    email,
                                    username,
                                    password: hashedPassword,
                                    date_created: 'now()',
                                }

                                return SignUpService.insertUser(
                                    req.app.get('db'),
                                    newUser
                                )
                                    .then(user => {
                                        res
                                            .status(201)
                                            .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                            .json(SignUpService.serializeUser(user))
                                    })
                            })
                    })
                    .catch(next)
    })

    module.exports = signUpRouter