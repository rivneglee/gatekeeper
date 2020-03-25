export default {
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
          condition: 'token.userId!=$routeParams.userId',
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
          condition: 'token.userId!=$response.body.userId',
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
