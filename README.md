#Development configuration
~~~~
{
  "host": "http://localhost:3000",
  "dbURI": "mongodb://ntvinh11586:qwertyuiop@ds119250.mlab.com:19250/travelappdb",
  "sessionSecret": "catscanfly",
  "fb": {
    "clientID": "405870893138343",
    "clientSecret": "b56fc7c5328cd1756917ab32574c5b5f",
    "callbackURL": "//localhost:3000/auth/facebook/callback",
    "profileFields": ["id", "displayName", "photos"]
  },
  "twitter": {
    "consumerKey": "QwiS9OYdy5S0mKK3htfUW165t",
    "consumerSecret": "FWKST9OPHnZqJZSjRNYFNzMYD2VFzbDPJmGi0Vb4tKVRJLS1F7",
    "callbackURL": "//localhost:3000/auth/twitter/callback",
    "profileFields": ["id", "displayName", "photos"]
  }
}
~~~~

#API

**REST API**:

`GET /`: Mount point.

`GET /auth/facebook`: Authenticate with FB.

`GET /auth/facebook/callback`: Callback after doing FB authentication.
- Success: `/user`.
- Failure: `/`.

`GET /auth/twitter`: Authenticate with Twitter.

`GET /auth/twitter/callback`: Callback after doing Twitter authentication.
- Success: `/user`.
- Failure: `/`.

`GET /user`: Get current user account information.
- Required: Authenticated.
- Request: `none`.
- Response: ["id", "displayName", "photos"].

**Socket API**

Comming soon...
