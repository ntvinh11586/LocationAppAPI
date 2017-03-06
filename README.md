#Development configuration
`````````````````
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
````````````````
