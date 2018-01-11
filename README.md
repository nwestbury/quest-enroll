# ualberta-enroll

Sign up for [mailgun](mailgun.com) and create a file
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
