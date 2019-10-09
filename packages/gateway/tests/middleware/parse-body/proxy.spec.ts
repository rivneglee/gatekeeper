import createProxy from '../../../src/middleware/parse-body/proxy';

describe('parse-body proxy', () => {
  let requestContentType = 'application/json';
  let responseContentType = 'application/json';
  const mockRequest: any = {
    get: () => requestContentType,
  };
  const mockResponse: any = {
    get: () => responseContentType,
  };
  const proxy = createProxy();
  describe('onRequest', () => {
    it('should convert payload into json if content type is application/json', () => {
      expect(proxy.onRequest(mockRequest, '{"value": "foo"}', {} as any)).toEqual({
        value: 'foo',
      });
    });
    it('should return original payload if content type is not application/json', () => {
      requestContentType = 'something else';
      expect(proxy.onRequest(mockRequest, 'foo', {} as any)).toBe('foo');
    });
  });
  describe('onResponse', () => {
    it('should convert payload into json if content type is application/json', () => {
      expect(proxy.onResponse(mockRequest, mockResponse, '{"value": "foo"}', {} as any)).toEqual({
        value: 'foo',
      });
    });
    it('should return original payload if content type is not application/json', () => {
      responseContentType = 'something else';
      expect(proxy.onResponse(mockRequest, mockResponse, 'foo', {} as any)).toBe('foo');
    });
  });
});
