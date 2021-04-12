const express = require('express');
const LogInService = require('./logIn-service');
const {requireAuth} = require('../middleware/jwt-auth');
const SignUpService = require('../signUp/signUp-service');
const logInRouter = express.Router()
const jsonBodyParser = express.json()

logInRouter
    .post('/log-in', jsonBodyParser, (req, res, next) => {
        const {username, password} = req.body
        const logInUser = {username, password}

        for (const [key, value] of Object.entries(logInUser))
            if (value == null)
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })

                LogInService.getUserWithUsername(
                    req.app.get('db'),
                    logInUser.username
                )
                    .then(dbUser => {
                        if (!dbUser)
                            return res.status(400).json({
                                error: {message: `Incorrect username or password`}
                            })

                        let compareMatch = LogInService.comparePasswords(logInUser.password, dbUser.password)
                        if (!compareMatch) {
                            return res.status(400).json({
                                error: {message: `Incorrect username or password'}` + ' ' +
                                logInUser.password + ' ' + 
                                SignUpService.hashPassword(logInUser.password)}
                            })
                        }
                        const sub = dbUser.username
                                const payload = {user_id: dbUser.id}
                                return res.send({
                                    authToken: LogInService.createJwt(sub, payload),
                                })

                        // return LogInService.comparePasswords(logInUser.password, dbUser.password)
                            // Bring this back later
                            /*.then(compareMatch => {
                                if (!compareMatch)
                                    SignUpService.hashPassword(logInUser.password)
                                        .then((password) => {
                                            console.log(password)
                                        })
                                    return res.status(400).json({
                                        error: {message: `Incorrect username or password'}` + ' ' +
                                        logInUser.password + ' ' + 
                                        SignUpService.hashPassword(logInUser.password)}
                                    })

                                const sub = dbUser.username
                                const payload = {user_id: dbUser.id}
                                res.send({
                                    authToken: LogInService.createJwt(sub, payload),
                                })
                            })*/
                    })
                    .catch(next)
    })

    logInRouter.post('/refresh', requireAuth, (req, res) => {
        const sub = req.user.username
        const payload = {user_id: req.user.id}
        res.send({
            authToken: LogInService.createJwt(sub, payload),
        })
    })

module.exports = logInRouter