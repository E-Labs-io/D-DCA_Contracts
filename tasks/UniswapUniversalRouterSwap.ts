/** @format */
import { task, types } from "hardhat/config";
import { newStrat } from "../deploy/deploymentArguments/DCA.arguments";
import { ChainName, tokenAddress } from "../bin/tokenAddress";
import { AddressLike } from "ethers";
import deployedDCAContracts from "~/bin/deployedAddress";

const taskId = "uniswap-swap";
const taskDescription =
  "Swap a given token for anther though Uniswap Universal Router";

task(taskId, taskDescription).setAction(async (_args, hre) => {
  console.log(`🟢 [TASK] ${taskId} : Mounted`);
  const [owner] = await hre.ethers.getSigners();
  const network = hre.network;
  const networkName: ChainName = network.name as ChainName;

  const SwapRouter = await hre.ethers.getContractAt(
    "IUniversalRouter",
    tokenAddress.universalRouter[networkName] as string,
    owner
  );
  console.log(
    `🟡 [TASK] ${taskId} : Connected to Universal Router`,
    SwapRouter
  );

  //  Get the USDC contract address for given network
  const usdcAddress = tokenAddress.usdc[
    network.name as ChainName
  ] as AddressLike;

  console.log(`🟡 [TASK] ${taskId} : Approving Account to spend USDC`);
  const usdcContract = await hre.ethers.getContractAt(
    "IERC20",
    await usdcAddress,
    owner
  );
  const tx = await usdcContract.approve(
    SwapRouter.target,
    hre.ethers.parseUnits("50000", 6)
  );
  await tx.wait();
  console.log(`🟢 [TASK] ${taskId} : Token Spend Approved`);

  const encodeSwapParameters = () => {
    const tokenIn = usdcAddress; // Address of the input token
    const tokenOut = tokenAddress.wbtc[networkName]; // Address of the output token
    const amountIn = 100 ** 6; // Exact amount of input tokens
    const amountOutMinimum = 0; // Minimum amount of output tokens
    const fee = 10000; // Fee tier of the liquidity pool
    const recipient = owner.address; // Address to receive the output tokens

    return 
  };

  const commands = ["0x00"];
  const inputs = [encodeSwapParameters()];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5; //  5 minutes from now

  const swap = await SwapRouter.execute(commands, inputs, deadline);
  await swap.wait();

  console.log(`🟢 [TASK] ${taskId} : Complete`);
});
