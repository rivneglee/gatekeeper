import match from '../../src/authorization/route-match';

describe('route-match', () => {
  describe('should return true', () => {
    it('if uri match string pattern', () => {
      const uri = '/logon';
      const pattern = '/logon';
      expect(match(uri, pattern)).toBe(true);
    });

    it('if uri match expression ending with wildcard', () => {
      const uri = '/papers/123/commits/456';
      const pattern = '/papers/*';
      expect(match(uri, pattern)).toBe(true);
    });

    it('if uri match expression pattern with inner wildcard', () => {
      const uri = '/papers/123/shared/commits/456';
      const pattern = '/papers/*/commits/:commitId';
      expect(match(uri, pattern)).toBe(true);
    });

    it('if uri match expression pattern with wildcard on same structure', () => {
      const uri = '/papers/123/commits/456';
      const pattern = '/papers/*/commits/*';
      expect(match(uri, pattern)).toBe(true);
    });

    it('if uri match expression pattern with path variables', () => {
      const uri = '/papers/123/commits/456';
      const pattern = '/papers/:paperId/commits/:commitId';
      expect(match(uri, pattern)).toBe(true);
    });
  });

  describe('should return false', () => {
    it('if uri doesn\'t follow pattern', () => {
      const uri = '/papers/123/commits/456';
      const pattern = '/papers/:paperId/shared/commits/:commitId';
      expect(match(uri, pattern)).toBe(false);
    });

    it('if uri ends with path but pattern ends with variable', () => {
      const uri = '/papers/123/shared/commits';
      const pattern = '/papers/*/commits/:commitId';
      expect(match(uri, pattern)).toBe(false);
    });
  });
});
