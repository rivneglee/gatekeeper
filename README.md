# Gatekeeper
[![CircleCI](https://circleci.com/gh/rivneglee/gatekeeper.svg?style=shield&circle-token=40a0962ba3c260631d78e8ee5db201436cef9ae1)](https://circleci.com/gh/rivneglee/workflows/gatekeeper)

## Introduction

Gatekeeper is a configuration gateway which aiming to integrate `Authentication`, `Authorization`, `Proxy` and Web UI based `Configuration` dashboard.
It consist of 3 packages:

- [express-gatekeeper-core](./packages/core)
    `express-gatekeeper-core` is a middleware set so you don't have to use gatekeeper-gateway and you can choose to use middlewares to achieve `Authentication`, `Authorization`, `Proxy`
    in your express application directly.
- express-gatekeeper-gateway
    API gateway configured via YAML
- express-gatekeeper-dashboard
    Web UI based dashboard
    
    
## Run test

```bash
yarn lint && yarn test && yarn test:e2e
```   

## Run build
```bash
yarn build
```
        



