# How to Create a credentials.json.enc

```
$ export encryption_key=$(openssl rand -hex 16) encryption_iv=$(openssl rand -hex 16)
$ openssl aes-256-cbc -K $encryption_key -iv $encryption_iv -in credentials.json -out credentials.json.enc
$ openssl aes-256-cbc -K $encryption_key -iv $encryption_iv -in credentials.json.enc -out credentials.json -d
```
