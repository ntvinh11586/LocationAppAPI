# Account

## Google, Facebook, Twitter Account

~~~~
Username: luanvantnk13@gmail.com
Password: datvavinh
~~~~

## Mlab Account (for hosting MongoDB)

~~~~
Username: luanvantnk13
Password: datvavinh123@
~~~~

~~~~
Database name: locationappdb
User: luanvantnk13
Passpord: datvavinh
~~~~

# API

## Header

`BASE_URL = "http://localhost:3000"`

## RESTful API

`GET /`: Mount point.

`GET /auth/facebook`: Authenticate with FB.
- Success: If users connect FB successfully, this route will redirect to `GET /auth/facebook/callback`.

`GET /auth/facebook/callback`: Callback after doing FB authentication.
- Success: Redirect to `/user` and response object declared in `user`.
- Failure: Redirect to `/`.

`GET /auth/twitter`: Authenticate with Twitter.
- Success: If users connect Twitter successfully, this route will redirect to `GET /auth/twitter/callback`.

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

## Socket API

Connection `/locations` (for more information how to use this routes, please see this implement in `/views/locations`:
- Usecase 1: Get current location: `emit: getCurrentLocation` -> `on: getLocation`.
  - Request: None.
  - Response: Current location (x, y) in system.
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
