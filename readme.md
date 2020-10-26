# Gateway API
Sample Gateway API which exposes different endpoints under `/api/gateway` to manage gateways and their associated devices

## Build & Run
`docker compose up -d`

API server will run on port `3000` by default, which can be changed by adjusting `PORT` environment variable in `.env.dist`.
Default database name is `gatewaydb` which can also be changed by adjusting `DB_NAME` env var.

## Test
`npm run test`

## Endpoints

1. `GET` `/api/gateways` - Lists all gateways
2. `POST` `/api/gateways` - Create new gateway
```http request
POST http://localhost:3000/api/gateways
Content-Type: application/json

{
  "name": "bar",
  "address": "127.0.0.2"
}
```
3. `GET` `/api/gateways/:id` - Gateway details
4. `GET` `/api/gateways/:id/devices` - List devices for a Gateway
4. `POST` `/api/gateways/:id/devices` - Create a device under a Gateway
```http request
POST http://localhost:3000/api/gateways/:id/devices
Content-Type: application/json

{
  "vendor": "foo",
  "status": "online|offline"
}
```
5. `GET` `/api/gateways/:id/devices/:did` - Device details for a Gateway
6. `DELETE` `/api/gateways/:id/devices/:did` - Remove a device from a Gateway

