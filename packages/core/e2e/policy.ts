export default {
  version: '1.0.0',
  name: 'FreeTierAccess',
  statements: [
    {
      resource: {
        pattern: '/:userId/orders/*',
        methods: '*',
      },
      ingress: [
        {
          effect: {
            type: 'deny',
          },
          condition: 'token.userId!=request.params.userId',
        },
      ],
    },
    {
      resource: {
        pattern: '/:userId/orders/:orderId',
        methods: 'GET',
      },
      egress: [
        {
          effect: {
            type: 'deny',
          },
          condition: 'token.userId!=response.body.userId',
        },
      ],
    },
    {
      resource: {
        pattern: '/admin/*',
        methods: '*',
      },
      ingress: [
        {
          effect: {
            type: 'deny',
          },
        },
      ],
    },
  ],
};
