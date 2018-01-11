# ualberta-enroll
[![Build Status](https://travis-ci.org/nlieb/ualberta-enroll.svg?branch=master)](https://travis-ci.org/nlieb/ualberta-enroll)

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

Then run `yarn install` and `node index.js`
