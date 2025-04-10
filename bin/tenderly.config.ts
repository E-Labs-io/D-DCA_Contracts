// Tenderly configuration
const getTenderlyConfig = () => {
  // Only enable Tenderly when TENDERLY_ENABLED is set to "true"
  const enabled = process.env.TENDERLY_ENABLED === "true";

  if (!enabled) {
    return undefined; // Return undefined instead of null
  }

  return {
    project: "dca",
    username: "E-Labs",
    privateVerification: true,
  };
};

export default getTenderlyConfig;
