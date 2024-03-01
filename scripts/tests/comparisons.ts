export const compareStructs = (actual: any, expected: any) => {
  // Check if the actual and expected values are arrays
  if (Array.isArray(actual) && Array.isArray(expected)) {
    // If they are arrays, compare their lengths
    if (actual.length !== expected.length) return false;
    // Recursively compare each element of the arrays
    for (let i = 0; i < actual.length; i++) {
      if (!compareStructs(actual[i], expected[i])) return false;
    }
    return true;
  } else {
    // If they are not arrays, compare their values
    return actual === expected;
  }
};
