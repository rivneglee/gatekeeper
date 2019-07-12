import match from '../../src/utilities/route-match';

describe('route-match', () => {
  it('should return true if uri absolutely equal to pattern', () => {
    expect(match('/abc/def/xyz', '/abc/def/xyz')).toBe(true);
  });
  it('should return false if uri not equal to pattern', () => {
    expect(match('/abc/def/xyz', '/abc/def/xyy')).toBe(false);
  });
  it('should return true if path variables contained in uri', () => {
    expect(match('/abc/123/xyz/def', '/abc/:id/xyz/:name')).toBe(true);
  });
  it('should return false if uri doesnt match to pattern', () => {
    expect(match('/abc/123/xyz/def', '/abc/:id/xyz/:name/xxx')).toBe(false);
  });
  it('should return true if wildcard is at end of pattern', () => {
    expect(match('/abc/123/xyz/def', '/abc/:id/xyz/:name*')).toBe(true);
  });
  it('should return true if wildcard is at middle of pattern', () => {
    expect(match('/abc/123/xyz/def', '/abc/:id/*/:name')).toBe(true);
  });
});
