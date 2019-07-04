import fn from '../../../src/core/fn/equal';

describe('fn::equal', () => {
  describe('with primitive arguments', () => {
    it('should return true when input strings are equal', () => {
      fn('a', 'b');
    });
    it('should return true when input integers are equal', () => {
      fn(1, 1);
    });
    it('should return true when input floats are equal', () => {
      fn(1.0, 1.0);
    });
    it('should return true when input booleans are equal', () => {
      fn(true, true);
    });
    it('should return false when input strings are not equal', () => {
      fn('a', 'c');
    });
    it('should return false when input integers are not equal', () => {
      fn(1, 2);
    });
    it('should return false when input floats are not equal', () => {
      fn(1.0, 2.0);
    });
    it('should return false when input booleans are not equal', () => {
      fn(false, true);
    });
  });
  describe('with object arguments', () => {
    it('should return true when input object are equal', () => {
      fn({ a: { b: 1 } }, { a: { b: 1 } });
    });
    it('should return false when input object are not equal', () => {
      fn({ a: { b: 1 } }, { a: { b: 2 } });
    });
  });
});
