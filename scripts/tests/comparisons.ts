import { BytesLike } from "ethers";
import { ethers } from "hardhat";

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

export const decodePackedBytes = (encodedData: BytesLike) => {
  // Convert the encoded data to a hex string
  const encodedHexString = ethers.hexlify(encodedData);

  // Remove the leading '0x'
  const encodedHexWithoutPrefix = encodedHexString.slice(2);

  // Split the string into pairs of characters (each representing a byte)
  const encodedBytes = encodedHexWithoutPrefix.match(/.{1,2}/g);

  // Convert each byte to a number
  const reinvestStrategies = encodedBytes!.map((byte) => parseInt(byte, 16));

  return reinvestStrategies;
};
