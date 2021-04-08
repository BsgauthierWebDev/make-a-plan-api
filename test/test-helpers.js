const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [
        {
            id: 100,
            email: 'test-user-1@test.com',
            username: 'test-username-1',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 200,
            email: 'test-user-2@test.com',
            username: 'test-username-2',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 300,
            email: 'test-user-3@test.com',
            username: 'test-username-3',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 400,
            email: 'test-user-4@test.com',
            username: 'test-username-4',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z')
        }
    ]
}

function makeProjectsArray(users, projects) {
    return [
        {
            id: 1,
            name: 'Test Name 1',
            description: 'Test Description 1',
            materials: 'Test Materials 1',
            steps: 'Test Steps 1',
            user_id: 'Test UserID 1',
            date_created: '2029-01-22T16:28:32.615Z',
            date_uploaded: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'Test Name 2',
            description: 'Test Description 2',
            materials: 'Test Materials 2',
            steps: 'Test Steps 2',
            user_id: 'Test UserID 2',
            date_created: '2029-01-22T16:28:32.615Z',
            date_uploaded: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'Test Name 3',
            description: 'Test Description 3',
            materials: 'Test Materials 3',
            steps: 'Test Steps 3',
            user_id: 'Test UserID 3',
            date_created: '2029-01-22T16:28:32.615Z',
            date_uploaded: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 4,
            name: 'Test Name 4',
            description: 'Test Description 4',
            materials: 'Test Materials 4',
            steps: 'Test Steps 4',
            user_id: 'Test UserID 4',
            date_created: '2029-01-22T16:28:32.615Z',
            date_uploaded: new Date('2029-01-22T16:28:32.615Z')
        }
    ]
}

function makeProjectFixtures() {
    const testUsers = makeUsersArray()
    const testProjects = makeProjectsArray()
    return {testUsers, testProjects}
}

module.exports = {
    makeUsersArray,
    makeProjectsArray,
    makeProjectFixtures
};