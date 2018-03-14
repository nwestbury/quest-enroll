# ualberta-enroll
[![Build Status](https://travis-ci.org/nlieb/ualberta-enroll.svg?branch=master)](https://travis-ci.org/nlieb/ualberta-enroll)

Basically this software checks your "Add" list in your schedule builder (not watchlist) for open classes. If one or more green circles is found, indicating that the class is open, it attempts to enroll in that class. Behavior is undefined for enrollment failures.

## Requirements
- Latest LTS version of [nodejs](https://nodejs.org/en/) 
- Latest stable version of [yarn](https://yarnpkg.com/lang/en/docs/install/)

## Usage
Sign up for [mailgun](https://mailgun.com) and create a file
called `credentials.json` with this content:

```
{
    "username": "your-username",
    "password": "your-password",
    "mailgun_api_key": "key-[your-unique-key]",
    "mailgun_domain": "sandbox[your-unique-sandbox-id].mailgun.org",
    "notify_email": "[your-personal-email]@provider.com"
}
```

Then run in the terminal in the root directory:
```
yarn install
node index.js
```
