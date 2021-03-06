BEGIN;

TRUNCATE
    users,
    projects
    RESTART IDENTITY CASCADE;

INSERT INTO users (email, username, password)
VALUES
    ('test123@test.com', 'username123', 'password123'),
    ('test456@test.com', 'username456', 'password456'),
    ('test789@test.com', 'username789', 'password789');

INSERT INTO projects (name, description, materials, steps, user_id)
VALUES  
    ('Test 1', '1st test project', 'Test materials 1', 'Test steps 1', 1),
    ('Test 2', '2nd test project', 'Test Materials 2', 'Test steps 2', 2),
    ('Test 3', null, 'Test materials 3', 'Test steps 3', 3);

COMMIT;