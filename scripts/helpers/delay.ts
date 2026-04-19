/** @format */

export default async function delay(ms: number, hideLog?: true) {
  !hideLog && console.log(`🕐 Delayed for ${ms / 1000} seconds`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
