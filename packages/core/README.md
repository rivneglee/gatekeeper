# Gatekeeper

### Authorization policy examples

- JSON

```json
  {
    "version": "1.0.0",
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
  version: 1.0.0
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
        methods: *
      ingress:
        - effect: 
            type: deny
```


