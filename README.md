# quest-enroll
[![Build Status](https://api.travis-ci.org/nwestbury/quest-enroll.svg?branch=master)](https://travis-ci.org/nwestbury/quest-enroll)

Requirements:
* yarn
* node >= 7.6

Sign up for [mailgun](https://mailgun.com) and create a file
called `credentials.json` with this content:

```
{
    "username": "your-username",
    "password": "your-password",
    "university": "[your-university-shorthand]",
    "mailgun_api_key": "key-[your-unique-key]",
    "mailgun_domain": "sandbox[your-unique-sandbox-id].mailgun.org",
    "notify_email": "[your-personal-email]@provider.com"
}
```

Then run `yarn install` and `node index.js`
