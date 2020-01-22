# HDR GATEWAY

## Node Web and Authentication Server

## Licence

Apache 2

## Author(s)

[IBM UK](https://www.ibm.com/uk-en)  
[Health Data Research UK](https://www.hdruk.ac.uk/)  
[University of Oxford, Department of Computer Science](http://www.cs.ox.ac.uk/)  
[Parity](https://www.parity.net/)  
[METADATAWORKS](https://metadataworks.co.uk/)  
​

## Contributors

To be added
​

## Relevant Repositories

React Front End Application [Repository](https://github.com/HDRUK/Gateway-Frontend)  
Node Web and Authentication Server [Repository](https://github.com/HDRUK/Gateway-Auth-Server)  
Node Graphql Data Handler [Repository](https://github.com/HDRUK/Gateway-Middleware)  
Postgres Database Creation and update [Repository](https://github.com/HDRUK/Gateway-DB)  
​

## Overview

The application provides a Node Express webserver, which enables the React Application to be served.

It handles the user login & registration through the Open Athens gateway.

It sends the emails to the Data Owner

## Installation

This is a node application, all node modules are installed locally.

Download or clone from Code Repsitory

[Bitbucket Repository](https://github.com/HDRUK/Gateway-Auth-Server)

from the downloaded directory run

npm install

This will install the application on port 5003 by default.

### .env file

Create an environment file with the following options:

> NODE_ENV=local
> PORT=5003
> APPLICATION_PATH=
>
> > This is the path to the build directory of the Front End React App

These are the open Athens (open ID) credentails. You will need to have an account

> CALLBACK_URL=  
> SESSION_SECRET=  
> AUTH_CLIENT_ID=  
> AUTH_CLIENT_SECRET=  
> AUTH_PROVIDER_URI=

The email send parameters

> EMAIL=
>
> > This enables an email to be defined for sending from

> RECIPIENT_EMAIL=
>
> > This enables an email to be used during development, instead of using the datasets data owner

> EMAIL_PASSWORD=  
> EMAIL_PORT=  
> EMAIL_HOST=  
> EMAIL_USER=

### Example .env file

NODE_ENV=local  
PORT=5003  
APPLICATION_PATH=/development/HDR_Gateway/HDR_Gateway_Auth_Web_Server/build

CALLBACK_URL=http://localhost:5003/redirect  
SESSION_SECRET=ExampleSecret  
AUTH_CLIENT_ID=hdruk.ac.uk.oidc-app-xxxxxxxxxxxxxxxxxx  
AUTH_CLIENT_SECRET=xxxxxxxxxxxxxx  
AUTH_PROVIDER_URI=https://connect.openathens.net

EMAIL=enquiry@somesite.org  
EMAIL_PASSWORD=xxxxxxxxxxxxx  
RECIPIENT_EMAIL=test@somesite.org  
EMAIL_PORT=2525  
EMAIL_HOST=smtp.someserver.io  
EMAIL_USER=xxxxxxxxxxxxx

## Running the Application

`npm run dev`

> Runs the application in node watch mode
> You need to have the React Front End application built into the required directory, and the node middleware running.

`npm start`

> runs the application without monitoring

## Other commands

`npm run lint`

> runs the Lint checker against the code base

`npm run test:coverage`

> runs the unit tests

`npm run sonarQube`

> runs the sonarQube code validator. You will need to either have a local copy running or configure a web service.

## Deployment

This is a node application, and requires deploying as such.

It needs to have the React Web front end built into its path and the environment variables configured accordingly.
