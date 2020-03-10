import validate from '../../src/authorization/validate';
import { EffectType, Method, Policy, When } from '../../src/types';
import { ALLOW_EFFECT, DENY_EFFECT, NOTHING_EFFECT } from '../../src/authorization/effects';

describe('validate', () => {
  const CUSTOM_EFFECT = {
    type: EffectType.Custom,
    data: {
      statusCode: 406,
    },
  };

  const policyA: Policy = {
    name: 'A',
    statements: [
      {
        resource: {
          pattern: '/:userId/papers/*',
          methods: [
            Method.GET,
            Method.POST,
          ],
        },
        egress: [
          {
            effect: ALLOW_EFFECT,
            condition: 'foo==bar',
          },
        ],
      },
    ],
  };

  const policyB: Policy = {
    name: 'B',
    statements: [
      {
        resource: {
          pattern: '/:userId/papers/*',
          methods: [
            Method.GET,
            Method.POST,
          ],
        },
        egress: [
          {
            effect: CUSTOM_EFFECT,
            condition: '!!token',
          },
          {
            effect: DENY_EFFECT,
            condition: '!!buzz',
          },
        ],
      },
    ],
  };

  it('should return NOTHING for a statement which only has egress rule defined when receive request', () => {
    expect(validate(
      '/abc/papers/123',
      Method.GET,
      When.Ingress,
      { foo: '1', bar: '1' },
       [policyA],
      )).toEqual(NOTHING_EFFECT);
  });

  it('should return given effect for a statement which only has egress rule defined when return response', () => {
    expect(validate(
      '/abc/papers/123',
      Method.GET,
      When.Egress,
      { foo: '1', bar: '1' },
      [policyA],
    )).toEqual(ALLOW_EFFECT);
  });

  it('should return NOTHING when rule doesn\'t match', () => {
    expect(validate(
      '/abc/papers/123',
      Method.GET,
      When.Egress,
      { foo: '1', bar: '2' },
      [policyA],
    )).toEqual(NOTHING_EFFECT);
  });

  it('should return NOTHING when route doesn\'t match', () => {
    expect(validate(
      '/abc/123',
      Method.GET,
      When.Egress,
      { foo: '1', bar: '2' },
      [policyA],
    )).toEqual(NOTHING_EFFECT);
  });

  it('should return NOTHING when route doesn\'t match', () => {
    expect(validate(
      '/abc/123',
      Method.GET,
      When.Egress,
      { foo: '1', bar: '2' },
      [policyA],
    )).toEqual(NOTHING_EFFECT);
  });

  it('should return NOTHING when method doesn\'t match', () => {
    expect(validate(
      '/abc/123',
      Method.DELETE,
      When.Egress,
      { foo: '1', bar: '1' },
      [policyA],
    )).toEqual(NOTHING_EFFECT);
  });

  describe('multiple policies sorting priority', () => {
    it('should return DENY when there is a deny effect rule matched', () => {
      expect(validate(
        '/abc/papers/123',
        Method.GET,
        When.Egress,
        { foo: '1', bar: '1', buzz: 'buzz' },
        [policyA, policyB],
      )).toEqual(DENY_EFFECT);
    });

    it('should return CUSTOM when there is a CUSTOM effect rule matched', () => {
      expect(validate(
        '/abc/papers/123',
        Method.GET,
        When.Egress,
        { foo: '1', bar: '1', token: 'token' },
        [policyA, policyB],
      )).toEqual(CUSTOM_EFFECT);
    });

    it('should return ALLOW when there is a ALLOW effect rule matched', () => {
      expect(validate(
        '/abc/papers/123',
        Method.GET,
        When.Egress,
        { foo: '1', bar: '1' },
        [policyA, policyB],
      )).toEqual(ALLOW_EFFECT);
    });
  });
});
