const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth Endpoints', function() {
    let db

    const {testUsers} = helpers.makeProjectsFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api.auth/log-in`, () => {
        beforeEach('insert users', () => 
        helpers.seedUsers(
            db,
            testUser
        )
    )

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
        const loginAttemptBody = {
            username: testUser.username,
            password: testUser.password
        }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                    return supertest(app)
                    .post('/api/auth/log-in')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
    })
    it(`responds 400 'invalid username or password' when bad username`, () => {
        const userInvalidUser = {username: 'user-not@here.com', password: 'existy'}
        return supertest(app)
            .post('/api/auth/log-in')
            .send(userInvalidUser)
            .expect(400, {error: `Incorrect email or password`})
    })
    it(`responds 400 'invalid username or password' when bad password`, () => {
        const userInvalidUser = {username: testUser.username, password: 'incorrect'}
        return supertest(app)
            .post('/api/auth/log-in')
            .send(userInvalidUser)
            .expect(400, {error: `Incorrect username or password`})
    })
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        const userValidCreds = {
            username: testUser.username,
            password: testUser.password
        }
        const expectedToken = jwt.sign(
            {user_id: testUser.id}, //payload
            process.env.JWT_SECRET,
            {
                subject: testUser.username,
                expiresIn: process.env.JWT_EXPIRY,
                algorithm: 'HS256'
            }
        )
        return supertest(app)
            .post('/api/auth/log-in')
            .send(userValidCreds)
            .expect(200, {
                authToken: expectedToken,
            })
        })
    })
})