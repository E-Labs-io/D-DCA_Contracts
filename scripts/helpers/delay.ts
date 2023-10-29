

export default async function delay(ms: number) {
    console.log(`🕐 Delayed for ${ms / 1000} seconds`)
  return new Promise((resolve) => setTimeout(resolve, ms));
}