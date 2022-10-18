## Introduction

This project is the backend of Didomi Company Limited, a leading international education provider that delivers extensive range of educational services to many students in Nigeria and all other countries.

- https://github.com/jofwitsolution
- https://didomiconsortium.com

This is the implementation of Didomi in Node.js.

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Populate the Database

    npm run data:import

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    npm test

All tests should pass.

### Start the Server

    npm run serve

This will launch the Node server on port 3006. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3006/api/universities

You should see the list of universities. That confirms that you have set up everything successfully.

### (Optional) Environment Variables

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac:

    export JWT_SECRET=yourSecureKey

On Windows:

    set JWT_SECRET=yourSecureKey

### Nodemailer was used in this project
To enable nodemailer functionality, google OAuth2 was setup. The details of the OAuth2 is in config/default.json. For security reasons this file has been ignored in .gitignore. Ensure to set this variables in production.

### This application is deployed to Heroku