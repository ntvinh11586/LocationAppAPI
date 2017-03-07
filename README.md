#Development configuration
~~~~json
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

**Header**

`BASE_URL = "http://localhost:3000"`

**RESTful API**:

`GET /`: Mount point.

`GET /auth/facebook`: Authenticate with FB.

`GET /auth/facebook/callback`: Callback after doing FB authentication.
- Success: Redirect to `/user` and response object declared in `user`.
- Failure: Redirect to `/`.

`GET /auth/twitter`: Authenticate with Twitter.

`GET /auth/twitter/callback`: Callback after doing Twitter authentication.
- Success: Redirect to `/user` and response object declared in `user`.
- Failure: Redirect to `/`.

`GET /user`: Get current user account information.
- Required: Authenticated.
- Request: `none`.
- Response: `["id", "displayName", "photos"]`.

Example: Response Object from `GET /user`
~~~~json
{
  "_id": "58bca98c8289adaf100778a5",
  "profileId": "666087390237404",
  "fullName": "Vinh Nguyen",
  "profilePic": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13139129_529432210569590_7029118375391825969_n.jpg?oh=0dbb02395acbe76603827125efcd5c94&oe=59729825",
  "__v": 0
}
~~~~

**Socket API**

Connection `/locations`:
- Usecase 1: Get current location: `emit: getCurrentLocation` -> `on: getLocation`.
  - Request: None.
  - Response: Current location (x, y).
- Usecase 2: Create new location and broadcast back: `emit: newLocation` -> `on: getLocation`.
  - Request: New location (x, y).
  - Response: New location (x, y) to current client and broadcast client.

Example: Request and Response Object `New location`: 
~~~~json
{
  "x": "1234", 
  "y": "5678"
}
~~~~
