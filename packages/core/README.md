# express-gatekeeper-core

This package provides a batch of middlewares and offers `express.js` project configurable authorization, 
forward request to upstream services. The most common use case is `gateway`. If you want to build a gateway with
abilities of authentication and authorization, then `express-gatekeeper-core` will be helpful.

## Installation
```bash
npm install express-gatekeeper-core
```

## Authorization

Authorization middleware can provide you a endpoint level access permission control for both ingress and egress traffic.
You can describe your permission strategy by a JSON object which is called `policy` here.

See below example of policy:

```json
  {
    "name": "StandardAccess",
    "statements": [
      {
        "resource": {
          "pattern": "/:userId/papers/*",
          "methods": [
            "GET",
            "POST"
          ]
        },
        "ingress": [
          {
            "condition": "token.userId==$routeParams.userId"
          }
        ],
        "egress": [
          {
            "effect": {
              "type": "deny"
            },
            "condition": "$response.body.userId!=$routeParams.userId"
          }
        ]
      },
      {
        "resource": {
          "pattern": "/admin/*",
          "methods": "*"
        },
        "ingress": [
          {
            "effect": {
              "type": "deny"
            }
          }
        ]
      }
    ]
  }
```

##### Example of middleware usage

```js
import { createAuthorizationMiddleware } from 'express-gatekeeper-core';

const app = express();

const getUserPolicies = (request) => {
  // you can define how to retrieve policies (i.e: from DB) by impl this callback 
  return db.findPoliciesByUserId(request.params.userId);
};
  
const getRequestContext = (request) => { 
  // you can define how to extract context (i.e: decode jwt token) by impl this callback;
  const accessToken = request.get('Authorization');
  const token = jwt.verify(accessToken, privateKey);
  return {
    token, 
  }
};

const authorizer = createAuthorizationMiddleware(
  getUserPolicies,
  getRequestContext,
);

app.use(authorizer);
````

##### Predefined context variables

You can use predefined context variables from condition section in your policy.

- $request
- $response
- $routeParams


## Proxy

Proxy helps you forward requests to upstream services by a configurable JSON object.

See below example

```json
{
  "endpoints": [
    {
      "resource": {
        "pattern": "/api/:userId/orders/*",
        "methods": "*"
      },
      "target": "http://localhost:9001/private"
    },
    {
      "resource": {
        "pattern": "/api/:userId/quotes/*",
        "methods": "*"
      },
      "target": "http://localhost:9001/private",
      "forward": {
        "prependPath": true
      }
    }
  ]
}
```

##### Example of middleware usage

```js
import { createProxyMiddleware } from 'express-gatekeeper-core';

const proxyOptions = { endpoints: [...] };

const proxyServer = express();

proxyServer.use(createProxyMiddleware(proxyOptions));
```

# Development

Run lint & fix
```bash
yarn lint
```

Run unit test with watch
```bash
yarn test:watch
```

Run e2e test
```bash
yarn test:2e2
```

Run examples
```bash
yarn example:auth
yarn example:proxy
```
