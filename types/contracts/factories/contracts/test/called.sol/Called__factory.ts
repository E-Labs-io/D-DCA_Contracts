/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  Called,
  CalledInterface,
} from "../../../../contracts/test/called.sol/Called";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "CallMeExecuted",
    type: "event",
  },
  {
    inputs: [],
    name: "active",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "callMe",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040526000805460ff1916600117905534801561001d57600080fd5b506103678061002d6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806302fb0c5e1461003b578063b0bea7251461005d575b600080fd5b6000546100489060ff1681565b60405190151581526020015b60405180910390f35b61006561007a565b60408051928352901515602083015201610054565b60008061008a6101906014610250565b60408051808201909152600b81526a1f1021b0b63632b226b29d60a91b6020820152909250600191506100c0906014848461012c565b6040805183815282151560208201527f2f2a8cfd08840ddb38005f0a66428fd335abaa51a7687a9533ed5d3609ed114e910160405180910390a16101286040518060400160405280600b81526020016a1f1021b0b63632b226b29d60a91b81525083836101a9565b9091565b6101a38484848460405160240161014694939291906102d6565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f7626db9200000000000000000000000000000000000000000000000000000000179052610223565b50505050565b61021e8383836040516024016101c193929190610307565b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fca7733b100000000000000000000000000000000000000000000000000000000179052610223565b505050565b61022c8161022f565b50565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b8082018082111561028a577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b92915050565b6000815180845260005b818110156102b65760208185018101518683018201520161029a565b506000602082860101526020601f19601f83011685010191505092915050565b6080815260006102e96080830187610290565b60208301959095525060408101929092521515606090910152919050565b60608152600061031a6060830186610290565b60208301949094525090151560409091015291905056fea26469706673582212206a41dbfad7dda3ca8c7635a6109a2de8328bd04d78f64f5aab00ae5adbce9ce164736f6c63430008140033";

type CalledConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CalledConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Called__factory extends ContractFactory {
  constructor(...args: CalledConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Called & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Called__factory {
    return super.connect(runner) as Called__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CalledInterface {
    return new Interface(_abi) as CalledInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Called {
    return new Contract(address, _abi, runner) as unknown as Called;
  }
}