import sort from '../../src/proxy/sort-endpoints';
import { Endpoint } from '../../src/types';

describe('sort-endpoints', () => {
  const endpoints: Endpoint[] = [
    {
      resource: {
        pattern: '/papers/*',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/*/commits',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/*/commits/*',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/foo/bar',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/:paperId/commits/:commitId',
        methods: '*',
      },
      target: 'foo',
    },
  ];

  const expected: Endpoint[] = [
    {
      resource: {
        pattern: '/papers/*/commits',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/:paperId/commits/:commitId',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/*/commits/*',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/papers/*',
        methods: '*',
      },
      target: 'foo',
    },
    {
      resource: {
        pattern: '/foo/bar',
        methods: '*',
      },
      target: 'foo',
    },
  ];

  it('should sort endpoints correctly', () => {
    expect(sort(endpoints)).toEqual(expected);
  });
});
