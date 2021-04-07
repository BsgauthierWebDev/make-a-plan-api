const LogInService = require('../logIn/logIn-service');

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(400).json({error: `Missing bearer token` + authToken})
    }
    else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try {
        const payload = LogInService.verifyJwt(bearerToken)
            
        LogInService.getUserWithUsername(
            req.app.get('db'),
            payload.sub,
            payload.user_id,
        )
            .then(user => {
                if (!user)
                    return res.status(401).json({error: `Unauthorized request` + payload})

                req.user = user
                next()
            })
            .catch(err => {
                console.error(err)
                next(err)
            })
    } catch(error) {
        res.status(401).json({error: `Unauthorized request` + error})
    }
}

module.exports = {
    requireAuth
}