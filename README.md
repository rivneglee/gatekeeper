## Project Introduction 
`Gatekeeper` is a access control layer on top of your microservices. 
By using `Gatekeeper` you can protect your api endpoints with authentication and authorization check.
`Gatekeeper` is comprised of two packages which are managed by lerna:
- **Core**
`gatekeeper-core` offers abilities of role and policy based validation in your javascript application.

- **Gateway** 
`gatekeeper-gateway` is built on `expressjs`. As its name it is a gateway, you can put your upstream services behind it
and enable authentication and authorization by very simple config.

You can use these two packages separately which means that you don't have to bind with `gatekeeper-gateway` if you don't want
and you can use your authentication/authorization in gateway by developing gateway middleware.


## Motivation
AWS IAM system is good example as a common service/layer for consumer identification and access policy management which are reusable
and configurable. Many projects have similar requirements on authorization and `Gatekeeper` aims to enable flexible access control management
in these projects.

## Main Features
- Policy based access control
- Configurable gateway
- Middleware

## Development
Quality Check
```bash
yarn install && yarn lint && yarn test
```
Run gateway
```bash
yarn gateway
```

## Usage
Configuration of gateway
```yml
admin:
  protocol: http
  port: 8280
gateway:
  protocol: http
  port: 8180
middlewares:
  body-parser:
  authentication:
    url: 'mongodb://127.0.0.1:27017'
    username:
    password:
  authorization:
endpoints:
  login:
    paths:
      - '/auth/token'
    proxy:
      forward:
        url: 'http://127.0.0.1:8280'
        stripPath: false
  admin:
    paths:
      - '/admin/*'
    proxy:
      forward:
        url: 'http://127.0.0.1:8280'
        stripPath: true
      additionalProps:
        authorization: true
        authentication: true
  your_exposed_api:
    paths:
      - '/api-a/*'
      - '/api-b/*'
    proxy:
      forward:
        url: 'http://127.0.0.1:5000'
        stripPath: true
      additionalProps:
        authorization: true
        authentication: true
```

## License
