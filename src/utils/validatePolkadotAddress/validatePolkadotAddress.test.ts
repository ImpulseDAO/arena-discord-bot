import { validatePolkadotAddress } from "./validatePolkadotAddress"

// You'll need to replace these with actual valid and invalid addresses
const validHexAddress = '0x9ac045ef14370ed1e7def278e81be5b28957d651390b33cc43b68564dad66962';
const validNonHexAddress = '5DLc3LrMk64GxfVjHPMceS7HdZQsh2U1o4WU7BhzaDtgu1MJ';
const invalidHexAddress = 'INVALID-HEX-ADDRESS';
const invalidNonHexAddress = 'INVALID-NON-HEX-ADDRESS';

describe('validatePolkadotAddress', () => {
  test('returns true for a valid hexadecimal address', () => {
    expect(validatePolkadotAddress(validHexAddress)).toBe(true);
  });

  test('returns true for a valid non-hexadecimal address', () => {
    expect(validatePolkadotAddress(validNonHexAddress)).toBe(true);
  });

  test('returns false for an invalid hexadecimal address', () => {
    expect(validatePolkadotAddress(invalidHexAddress)).toBe(false);
  });

  test('returns false for an invalid non-hexadecimal address', () => {
    expect(validatePolkadotAddress(invalidNonHexAddress)).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(validatePolkadotAddress('')).toBe(false);
  });

  test('returns false for a random string', () => {
    expect(validatePolkadotAddress('randomString123')).toBe(false);
  });
});
