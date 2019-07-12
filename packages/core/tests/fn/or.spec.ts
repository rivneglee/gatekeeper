import fn from '../../src/fn/or';

describe('fn::or', () => {
  it('should return true when all arguments are true', () => {
    expect(fn(true, true, true)).toBe(true);
  });
  it('should return false when one argument is false', () => {
    expect(fn(true, false, false)).toBe(true);
  });
  it('should return false when all arguments are false', () => {
    expect(fn(false, false, false)).toBe(false);
  });
});
