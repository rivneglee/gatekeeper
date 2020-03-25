# Gatekeeper

### Authorization policy examples

- JSON

```json
  {
    "name": "FreeTierAccess",
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
            "condition": "token.userId==request.params.userId"
          }
        ],
        "egress": [
          {
            "effect": {
              "type": "deny"
            },
            "condition": "response.body.userId!=request.params.userId"
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

- YAML

```yaml
  name: FreeTierAccess
  statements:
    - resource: 
        pattern: /:userId/papers/*
        methods: 
          - GET
          - POST
      ingress:
        - condition: token.userId==request.params.userId
      egress: 
        - effect: 
            type: deny
          condition: response.body.userId!=request.params.userId
    - resource: 
        pattern: /admin/*
        methods: "*"
      ingress:
        - effect: 
            type: deny
```


### Proxy example

- YAML

```yaml
endpoints:
  - resource:
      pattern: /api/:userId/orders/*
      methods: "*"
    target: http://localhost:9001/private
  - resource:
      pattern: /api/:userId/quotes/*
      methods: "*"
    target: http://localhost:9001/private
    forward:
      prependPath: true
```
