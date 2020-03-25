import resolve from '../../src/proxy/resolve-path';
import { Resource } from '../../src/types';

describe('resolve-path', () => {
  const resource: Resource = {
    pattern: '/public/api/users/*',
    methods: '*',
  };

  const request: any = {
    path: '/public/api/users/username',
  };

  it('should return correct url when no forward options given', () => {
    expect(resolve(request, {
      resource,
      target: 'http://www.gatekeeper.com:5000/path',
    })).toEqual('/public/api/users/username');
  });

  it('should return correct url when prependPath is true', () => {
    expect(resolve(request, {
      resource,
      target: 'http://www.gatekeeper.com:5000/path',
      forward: {
        prependPath: true,
      },
    })).toEqual('/path/public/api/users/username');
  });

  it('should return correct url when prependPath and ignorePath are true', () => {
    expect(resolve(request, {
      resource,
      target: 'http://www.gatekeeper.com:5000/path',
      forward: {
        prependPath: true,
        ignorePath: true,
      },
    })).toEqual('/path');
  });

  it('should return correct url when ignorePath is true', () => {
    expect(resolve(request, {
      resource,
      target: 'http://www.gatekeeper.com:5000/path/',
      forward: {
        ignorePath: true,
      },
    })).toEqual('/');
  });

  it('should return correct url when ignorePath is true', () => {
    expect(resolve(request, {
      resource,
      target: 'http://www.gatekeeper.com:5000/path',
      forward: {
        prependPath: true,
        stripPath: true,
      },
    })).toEqual('/path/username');
  });
});
