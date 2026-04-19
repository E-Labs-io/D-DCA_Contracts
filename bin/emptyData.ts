import { IDCADataStructures } from "~/types/contracts/contracts/base/DCAExecutor";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const EMPTY_TOKEN_DATA = [ZERO_ADDRESS, 0n, ""];

export const EMPTY_REINVEST = ["0x", false, 0n, ZERO_ADDRESS];
export const EMPTY_STRATEGY = [
  ZERO_ADDRESS,
  EMPTY_TOKEN_DATA,
  EMPTY_TOKEN_DATA,
  0n,
  0n,
  0n,
  false,
  EMPTY_REINVEST,
];

export const EMPTY_TOKEN_DATA_OBJECT: IDCADataStructures.TokenDataStruct = {
  tokenAddress: EMPTY_TOKEN_DATA[0] as string,
  decimals: 0n,
  ticker: "0x00",
};
export const EMPTY_REINVEST_OBJECT: IDCADataStructures.ReinvestStruct = {
  reinvestData: "0x",
  active: false,
  investCode: 0n,
  dcaAccountAddress: ZERO_ADDRESS,
};

export const EMPTY_STRATEGY_OBJECT: IDCADataStructures.StrategyStruct = {
  accountAddress: ZERO_ADDRESS,
  baseToken: EMPTY_TOKEN_DATA_OBJECT,
  targetToken: EMPTY_TOKEN_DATA_OBJECT,
  interval: 0n,
  amount: 0n,
  strategyId: 0n,
  active: false,
  reinvest: EMPTY_REINVEST_OBJECT,
};
