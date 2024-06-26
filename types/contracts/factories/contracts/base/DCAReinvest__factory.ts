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
import type { NonPayableOverrides } from "../../../common";
import type {
  DCAReinvest,
  DCAReinvestInterface,
} from "../../../contracts/base/DCAReinvest";

const _abi = [
  {
    inputs: [
      {
        internalType: "bool",
        name: "activeLibrary",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "newState_",
        type: "bool",
      },
    ],
    name: "ContractActiveStateChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "ACTIVE_REINVESTS",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REINVEST_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "reinvestData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "investCode",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "dcaAccountAddress",
            type: "address",
          },
        ],
        internalType: "struct IDCADataStructures.Reinvest",
        name: "reinvestData_",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "executeReinvest",
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
  {
    inputs: [],
    name: "getLibraryVersion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "code_",
        type: "uint8",
      },
    ],
    name: "getModuleName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "isActive",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "reinvestData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "investCode",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "dcaAccountAddress",
            type: "address",
          },
        ],
        internalType: "struct IDCADataStructures.Reinvest",
        name: "oldReinvestData_",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "reinvestData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "investCode",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "dcaAccountAddress",
            type: "address",
          },
        ],
        internalType: "struct IDCADataStructures.Reinvest",
        name: "newReinvestData_",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "withdrawFunds_",
        type: "bool",
      },
    ],
    name: "migrateReinvest",
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
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setActiveState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "reinvestData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "investCode",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "dcaAccountAddress",
            type: "address",
          },
        ],
        internalType: "struct IDCADataStructures.Reinvest",
        name: "reinvestData_",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "unwindReinvest",
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
  "0x60806040526000805460ff60a01b1916600160a01b17905534801561002357600080fd5b5060405161118638038061118683398101604081905261004291610118565b338061006857604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61007181610081565b5061007b816100d1565b50610141565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000805460ff60a01b1916600160a01b83151590810291909117825560405190917fbdf1a3ee1d5eb15aa60ae1a81488107759732ead44999c8c807575100def058b91a250565b60006020828403121561012a57600080fd5b8151801515811461013a57600080fd5b9392505050565b611036806101506000396000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c80638da5cb5b11610081578063c9f6d48f1161005b578063c9f6d48f14610216578063f2fde38b1461027d578063f58a59361461029057600080fd5b80638da5cb5b146101c8578063bcb9236e146101f0578063c7b785e81461020357600080fd5b8063454f002a116100b2578063454f002a1461015c578063715018a614610184578063738800b71461018c57600080fd5b80630ca75044146100d957806322f3e2d41461012457806340438aea14610152575b600080fd5b60408051808201909152600981527f544553542056302e35000000000000000000000000000000000000000000000060208201525b60405161011b9190610bf4565b60405180910390f35b60005474010000000000000000000000000000000000000000900460ff16604051901515815260200161011b565b61015a6102a9565b005b61016f61016a366004610e05565b6102db565b6040805192835290151560208301520161011b565b61015a6103a3565b61010e6040518060400160405280600981526020017f544553542056302e35000000000000000000000000000000000000000000000081525081565b60005460405173ffffffffffffffffffffffffffffffffffffffff909116815260200161011b565b61016f6101fe366004610e05565b6103b5565b61010e610211366004610e4a565b6103c2565b61010e6040517f010000000000000000000000000000000000000000000000000000000000000060208201527f1200000000000000000000000000000000000000000000000000000000000000602182015260220160405160208183030381529060405281565b61015a61028b366004610e67565b6103d6565b61016f61029e366004610e84565b600080935093915050565b6102b161043a565b6000546102d99074010000000000000000000000000000000000000000900460ff161561048d565b565b60008054819074010000000000000000000000000000000000000000900460ff1661038d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f4f6e6c79416374697665203a205b69734163746976655d20436f6e747261637460448201527f206973207061757365640000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6103978484610500565b915091505b9250929050565b6103ab61043a565b6102d96000610586565b60008061039784846105fb565b60606103d08260ff1661063a565b92915050565b6103de61043a565b73ffffffffffffffffffffffffffffffffffffffff811661042e576040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260006004820152602401610384565b61043781610586565b50565b60005473ffffffffffffffffffffffffffffffffffffffff1633146102d9576040517f118cdaa7000000000000000000000000000000000000000000000000000000008152336004820152602401610384565b600080547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff167401000000000000000000000000000000000000000083151590810291909117825560405190917fbdf1a3ee1d5eb15aa60ae1a81488107759732ead44999c8c807575100def058b91a250565b6040820151600090819060ff8116610518575061039c565b600160ff82160361053b57610531848660000151610707565b925092505061039c565b601160ff82161461057e577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffee60ff82160161057e576105318486600001516107c3565b509250929050565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080601160ff16846040015160ff16111561039c57601260ff16846040015160ff160361039c57610631838560000151610a8c565b9150915061039c565b606060ff821661067d57505060408051808201909152600a81527f4e6f742041637469766500000000000000000000000000000000000000000000602082015290565b60ff82166001036106c157505060408051808201909152601581527f466f7277617264205265696e766573742056302e320000000000000000000000602082015290565b60ff8216601203610702575060408051808201909152601081527f41617665205633205265696e766573740000000000000000000000000000000060208201525b919050565b600080600061071584610b61565b604081810151602083015191517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff928316600482015260248101899052929350169063a9059cbb906044016020604051808303816000875af1158015610796573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ba9190610efc565b94959350505050565b60008060006107d184610b61565b60408082015190517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015291925060009173ffffffffffffffffffffffffffffffffffffffff909116906370a0823190602401602060405180830381865afa158015610847573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086b9190610f19565b60208301516040517f095ea7b3000000000000000000000000000000000000000000000000000000008152736ae43d3271ff6888e7fc43fd7321a503ff73895160048201526024810189905291925060009173ffffffffffffffffffffffffffffffffffffffff9091169063095ea7b3906044016020604051808303816000875af11580156108fe573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109229190610efc565b90508015610a825760208301516040517f617ba03700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526024810188905230604482015260006064820152736ae43d3271ff6888e7fc43fd7321a503ff7389519063617ba03790608401600060405180830381600087803b1580156109bf57600080fd5b505af11580156109d3573d6000803e3d6000fd5b5050505060408381015190517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009173ffffffffffffffffffffffffffffffffffffffff16906370a0823190602401602060405180830381865afa158015610a48573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a6c9190610f19565b9050610a788382610f32565b9550600086119450505b5050509250929050565b6000806000610a9a84610b61565b60208101516040517f69328dec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff909116600482015260248101879052306044820152909150736ae43d3271ff6888e7fc43fd7321a503ff738951906369328dec906064016020604051808303816000875af1158015610b30573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b549190610f19565b9586151595509350505050565b604080516060810182526000808252602080830182905292820152825190916103d09184018101908401610fe4565b6000815180845260005b81811015610bb657602081850181015186830182015201610b9a565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b602081526000610c076020830184610b90565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516080810167ffffffffffffffff81118282101715610c6057610c60610c0e565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715610cad57610cad610c0e565b604052919050565b801515811461043757600080fd5b803561070281610cb5565b60ff8116811461043757600080fd5b803561070281610cce565b73ffffffffffffffffffffffffffffffffffffffff8116811461043757600080fd5b803561070281610ce8565b600060808284031215610d2757600080fd5b610d2f610c3d565b9050813567ffffffffffffffff80821115610d4957600080fd5b818401915084601f830112610d5d57600080fd5b8135602082821115610d7157610d71610c0e565b610da1817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f85011601610c66565b92508183528681838601011115610db757600080fd5b81818501828501376000818385010152828552610dd5818701610cc3565b8186015250505050610de960408301610cdd565b6040820152610dfa60608301610d0a565b606082015292915050565b60008060408385031215610e1857600080fd5b823567ffffffffffffffff811115610e2f57600080fd5b610e3b85828601610d15565b95602094909401359450505050565b600060208284031215610e5c57600080fd5b8135610c0781610cce565b600060208284031215610e7957600080fd5b8135610c0781610ce8565b600080600060608486031215610e9957600080fd5b833567ffffffffffffffff80821115610eb157600080fd5b610ebd87838801610d15565b94506020860135915080821115610ed357600080fd5b50610ee086828701610d15565b9250506040840135610ef181610cb5565b809150509250925092565b600060208284031215610f0e57600080fd5b8151610c0781610cb5565b600060208284031215610f2b57600080fd5b5051919050565b818103818111156103d0577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600060608284031215610f7e57600080fd5b6040516060810181811067ffffffffffffffff82111715610fa157610fa1610c0e565b80604052508091508251610fb481610cce565b81526020830151610fc481610ce8565b60208201526040830151610fd781610ce8565b6040919091015292915050565b600060608284031215610ff657600080fd5b610c078383610f6c56fea26469706673582212204cbd446c7f02eea1d59af69fef606e5a248acbb57871710704f4b77704d9578b64736f6c63430008140033";

type DCAReinvestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DCAReinvestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DCAReinvest__factory extends ContractFactory {
  constructor(...args: DCAReinvestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    activeLibrary: boolean,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(activeLibrary, overrides || {});
  }
  override deploy(
    activeLibrary: boolean,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(activeLibrary, overrides || {}) as Promise<
      DCAReinvest & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DCAReinvest__factory {
    return super.connect(runner) as DCAReinvest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DCAReinvestInterface {
    return new Interface(_abi) as DCAReinvestInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): DCAReinvest {
    return new Contract(address, _abi, runner) as unknown as DCAReinvest;
  }
}
