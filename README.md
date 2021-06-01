## Make A Plan API

# Make A Plan
https://make-a-plan-bsgauthierwebdev.vercel.app/

<hr>
make-a-plan-api
<hr />
This API allows the Make A Plan user to interact with their acccount.

## Endpoints
### Users Endpoints
#### POST/api/sign-up
Name       | Type       | In        | Description
-----------|------------|-----------|------------
email | string | body | REQUIRED
username | string | body | REQUIRED
password | string | body | REQUIRED
<li>authToken: ********</li>
<li>Status: 400 'Incorrect username or password'</li>
<li>Status: 400 `Missing '${key}' in request body</li>

#### POST/api/log-in
Name       | Type       | In        | Description
-----------|------------|-----------|------------
username | string | body | REQUIRED
password | string | body | REQUIRED
<li>Status: 201 ('authToken': 'eyJhbGciOsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjox20ifQ.U-KjAKzBySAnFeshBQoOPK2ErLdgBI')</li>
<li>Status: 400 'Username already taken'</li>
<li>Status: 400 `Missing '${key}' in request body`</li>

## All Endpoints below require Auth
<hr />

#### GET/api/user/projects
Name           | Type           | In            | Description
---------------|----------------|---------------|----------------
bearer token | JWT | Authorization | REQUIRED
<li>Status: 401 'Unauthorized'</li>
<li>Status: 201 JSON data [{'id': 1, 'name': 'Test', 'date_modified': '5/31/2021', 'description': 'Test', 'materials': 'Test Mat 1, Test Mat 2, Test Mat 3', 'steps': 'Test Steps 1, Test Steps 2, Test Steps 3'}]</li>
<hr />

#### POST/api/user/projects
Name           | Type           | In            | Description
---------------|----------------|---------------|----------------
bearer token | JWT | Authorization | REQUIRED
name | string | body | REQUIRED
description | string | body | 
materials | string | body | REQUIRED
steps | string | body | REQUIRED
<li>Status: 401 'Unauthorized'</li>
<li> Statis: 400 `Missing '${key}' in request body`
<li>Status: 201 JSON data [{'id': 2, 'name': 'Test 2', 'date_modified': '5/31/2021', 'description': 'Another Test', 'materials': 'Test Mat 1, Test Mat 2, Test Mat 3', 'steps': 'Test Steps 1, Test Steps 2, Test Steps 3'}]</li>
<hr />

#### GET/api/user/projects/{project_id}
Name           | Type           | In            | Description
---------------|----------------|---------------|----------------
bearer token | JWT | Authorization | REQUIRED
project_id | number | path | REQUIRED
<li>Status: 401 'Unauthorized'</li>
<li>Status: 201 JSON data [{'id': 1, 'name': 'Test', 'date_modified': '5/31/2021', 'description': 'Test', 'materials': 'Test Mat 1, Test Mat 2, Test Mat 3', 'steps': 'Test Steps 1, Test Steps 2, Test Steps 3'}]</li>
<hr />

#### PATCH/api/user/projects/{project_id}
Name           | Type           | In            | Description
---------------|----------------|---------------|----------------
bearer token | JWT | Authorization | REQUIRED
project_id | number | path | REQUIRED
materials | string | body | REQUIRED
steps | string | body | REQUIRED
<li>Status: 401 'Unauthorized'</li>
<li>Status: 201 JSON data [{'id': 1, 'name': 'Test', 'date_modified': '5/31/2021', 'description': 'Test', 'materials': 'Test Mat 1, Test Mat 2, Test Mat 3', 'steps': 'Test Steps 1, Test Steps 2, Test Steps 3'}]</li>
<hr />

# How to Use Make A Plan

<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/landing-page.JPG'>

Make A Plan is a site where users can keep track of projects throughout all stages; from the gathering of materials to the completion of all necessary steps.
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/demo.JPG'>
<br />

New users can sign up for an account:
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/demo.JPG'>
<br />

Once signed up, users can log into their account:
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/demo.JPG'>
<br />

Make A Plan keeps track of all projects in their account, active and completed:
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/user-home.JPG'>
<br />

And users can keep track of their progress throughout the life of the project:
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/user-home.JPG'>
<br />

Make A Plan is mobile-friendly as well!
<br />
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/user-home.JPG'>
<img src = 'https://github.com/BsgauthierWebDev/make-a-plan/blob/master/images/mobile-user-project.JPG'>
<hr />

# Technology Used
* JavaScript
* React
* JSX
* CSS
* HTML
* AJAX
* JWT
* SQL
* postgresql
* Node
* Express
* Heroku
* Vercel
