export default {
  endpoints: [
    {
      resource: {
        pattern: '/api/:userId/orders/*',
        methods: '*',
      },
      target: 'http://localhost:9001/private',
    },
    {
      resource: {
        pattern: '/api/:userId/quotes/*',
        methods: '*',
      },
      target: 'http://localhost:9001/private',
      forward: {
        prependPath: true,
      },
    },
  ],
};
