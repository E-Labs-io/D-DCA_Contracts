/** @format */

const ZeroAddress = "0x0000000000000000000000000000000000000000";

function isZeroAddress(address: string): boolean {
  return address === ZeroAddress;
}

function setZeroAddress(): string {
  return ZeroAddress;
}

export { ZeroAddress, isZeroAddress, setZeroAddress };
