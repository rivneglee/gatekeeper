import fn from '../../../src/core/fn/not';

describe('fn::not', () => {
  describe('with primitive arguments', () => {
    it('should return false when input strings are equal', () => {
      expect(fn('a', 'a')).toBe(false);
    });
    it('should return false when input integers are equal', () => {
      expect(fn(1, 1)).toBe(false);
    });
    it('should return false when input floats are equal', () => {
      expect(fn(1.0, 1.0)).toBe(false);
    });
    it('should return false when input booleans are equal', () => {
      expect(fn(true, true)).toBe(false);
    });
    it('should return true when input strings are not equal', () => {
      expect(fn('a', 'b')).toBe(true);
    });
    it('should return true when input integers are not equal', () => {
      expect(fn(1, 2)).toBe(true);
    });
    it('should return true when input floats are not equal', () => {
      expect(fn(1.0, 2.0)).toBe(true);
    });
    it('should return true when input booleans are not equal', () => {
      expect(fn(true, false)).toBe(true);
    });
  });
  describe('with object arguments', () => {
    it('should return false when input object are equal', () => {
      expect(fn({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
    });
    it('should return true when input object are not equal', () => {
      expect(fn({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
    });
  });
});
