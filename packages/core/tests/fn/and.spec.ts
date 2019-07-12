import fn from '../../src/fn/and';

describe('fn::and', () => {
  it('should return true when all arguments are true', () => {
    expect(fn(true, true, true)).toBe(true);
  });
  it('should return false when one argument is false', () => {
    expect(fn(true, false, true)).toBe(false);
  });
  it('should return false when all arguments are false', () => {
    expect(fn(false, false, false)).toBe(false);
  });
});
