/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  DCAFactory,
  DCAFactoryInterface,
} from "../../../contracts/DCAAccountFactory.sol/DCAFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "executorAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "swapRouter_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dcaAccount",
        type: "address",
      },
    ],
    name: "DCAAccountCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "createDCAAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getDCAAccountsOfUser",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userDCAAccounts",
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
] as const;

const _bytecode =
  "0x60a060405234801561001057600080fd5b506040516132d23803806132d283398101604081905261002f91610076565b6001600160a01b03908116608052600180546001600160a01b031916929091169190911790556100a9565b80516001600160a01b038116811461007157600080fd5b919050565b6000806040838503121561008957600080fd5b6100928361005a565b91506100a06020840161005a565b90509250929050565b60805161320e6100c4600039600061012d015261320e6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633b3d958d14610046578063a82400be1461006f578063e33d5b6f14610079575b600080fd5b610059610054366004610284565b6100a4565b60405161006691906102a6565b60405180910390f35b610077610118565b005b61008c6100873660046102f3565b610223565b6040516001600160a01b039091168152602001610066565b6001600160a01b0381166000908152602081815260409182902080548351818402810184019094528084526060939283018282801561010c57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116100ee575b50505050509050919050565b6001546040516000916001600160a01b0316907f00000000000000000000000000000000000000000000000000000000000000009033906101589061025b565b6001600160a01b03938416815291831660208301529091166040820152606001604051809103906000f080158015610194573d6000803e3d6000fd5b503360008181526020818152604080832080546001810182559084529282902090920180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b038616908117909155915191825292935090917f4dbd862b60832d302519f1fa10b6a9f39767439003548858e1ca5bacdcf94463910160405180910390a250565b6000602052816000526040600020818154811061023f57600080fd5b6000918252602090912001546001600160a01b03169150829050565b612ebb8061031e83390190565b80356001600160a01b038116811461027f57600080fd5b919050565b60006020828403121561029657600080fd5b61029f82610268565b9392505050565b6020808252825182820181905260009190848201906040850190845b818110156102e75783516001600160a01b0316835292840192918401916001016102c2565b50909695505050505050565b6000806040838503121561030657600080fd5b61030f83610268565b94602093909301359350505056fe60a06040526008805462ffffff60a01b191661027160a41b1790553480156200002757600080fd5b5060405162002ebb38038062002ebb8339810160408190526200004a91620002b6565b82816001600160a01b0381166200007c57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b62000087816200018a565b50600180546001600160a01b0319166001600160a01b0392909216919091179055620000b383620001da565b506001600160a01b031660805250600760205260147f6d5257204ebe7d88fd91ae87941cb2dd9d8062b64ae5a2bd2d28ec40b9fbf6df556116807fb39221ace053465ec3453ce2b36430bd138b997ecea25c1043da0c366812b82855612d007fb7c774451310d1be4108bc180d1b52823cb0ee0274a6c0081bcaf94f115fb96d55619d807f3be6fd20d5acfde5b873b48692cd31f4d3c7e8ee8a813af4696af8859e5ca6c65560046000526202a3007fb805995a7ec585a251200611a61d179cfd7fb105e1ab17dc415a7336783786f75562000300565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6008546001600160a01b03808316911603620002395760405162461bcd60e51b815260206004820152601f60248201527f416c7265616479207573696e67207468697320444341206578656375746f7200604482015260640162000073565b600880546001600160a01b03199081166001600160a01b038416908117909255600180549091168217905560408051918252517f5143bfc9ce9795735e71faebae63e6679d7d1cbc32cd175adf3801580709a2999181900360200190a150565b80516001600160a01b0381168114620002b157600080fd5b919050565b600080600060608486031215620002cc57600080fd5b620002d78462000299565b9250620002e76020850162000299565b9150620002f76040850162000299565b90509250925092565b608051612b916200032a60003960008181611a9c01528181611b4e0152611d0d0152612b916000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c8063bff7f69e116100cd578063dbadd4cb11610081578063e5cb579311610066578063e5cb579314610317578063ea26752e1461032a578063f2fde38b1461033d57600080fd5b8063dbadd4cb146102db578063df79f1e0146102ee57600080fd5b8063ca4c8b31116100b2578063ca4c8b3114610295578063cc821a6b146102a8578063d9487144146102bb57600080fd5b8063bff7f69e1461024c578063c8f62ee41461027557600080fd5b80638da5cb5b11610124578063a30b199711610109578063a30b1997146101fd578063aa02fa8f14610210578063b87462fe1461022357600080fd5b80638da5cb5b146101cf5780639665b658146101ea57600080fd5b80636f2d41cb116101555780636f2d41cb1461018e5780636fbac7b5146101a1578063715018a6146101c757600080fd5b80630853ac1c146101715780630a2f52a61461017b575b600080fd5b610179610350565b005b610179610189366004612335565b610377565b61017961019c366004612335565b61040e565b6101b46101af36600461236a565b6106ed565b6040519081526020015b60405180910390f35b610179610721565b6000546040516001600160a01b0390911681526020016101be565b6101796101f836600461236a565b610735565b61017961020b366004612335565b61076c565b61017961021e366004612385565b610b03565b6101b461023136600461236a565b6001600160a01b031660009081526003602052604090205490565b6101b461025a36600461236a565b6001600160a01b031660009081526004602052604090205490565b6101b46102833660046123d0565b60076020526000908152604090205481565b6101796102a33660046123eb565b610b26565b6101796102b6366004612422565b610cd9565b6102ce6102c9366004612335565b610dec565b6040516101be91906124f5565b6101796102e936600461272c565b61104a565b6101b46102fc36600461236a565b6001600160a01b031660009081526006602052604090205490565b610179610325366004612422565b611296565b610179610338366004612422565b611357565b61017961034b36600461236a565b611461565b6103586114b5565b6001805473ffffffffffffffffffffffffffffffffffffffff19169055565b61037f6114b5565b6002818154811061039257610392612846565b906000526020600020906009020160080160019054906101000a900460ff166104025760405162461bcd60e51b815260206004820181905260248201527f537472617465677920697320616c726561647920556e7375627363726962656460448201526064015b60405180910390fd5b61040b816114fb565b50565b6104166114b5565b6002818154811061042957610429612846565b906000526020600020906009020160080160019054906101000a900460ff16156104955760405162461bcd60e51b815260206004820152601e60248201527f537472617465677920697320616c72656164792053756273637269626564000060448201526064016103f9565b61040b600282815481106104ab576104ab612846565b6000918252602091829020604080516101208101825260099390930290910180546001600160a01b03908116845282516060810184526001830180549283168252600160a01b90920460ff168187015260028301805495969395938701949193918401916105189061285c565b80601f01602080910402602001604051908101604052809291908181526020018280546105449061285c565b80156105915780601f1061056657610100808354040283529160200191610591565b820191906000526020600020905b81548152906001019060200180831161057457829003601f168201915b505050919092525050508152604080516060810182526003840180546001600160a01b0381168352600160a01b900460ff1660208084019190915260048601805491909501949293919291840191906105e99061285c565b80601f01602080910402602001604051908101604052809291908181526020018280546106159061285c565b80156106625780601f1061063757610100808354040283529160200191610662565b820191906000526020600020905b81548152906001019060200180831161064557829003601f168201915b505050919092525050508152600582015460209091019060ff16600481111561068d5761068d6124bd565b600481111561069e5761069e6124bd565b8152600682015460208201526007820154604082015260089091015460ff80821615156060840152610100820416151560808301526201000090046001600160a01b031660a090910152611847565b6001600160a01b038116600090815260066020908152604080832054600390925282205461071b91906128ac565b92915050565b6107296114b5565b61073360006119bf565b565b61073d6114b5565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6001546001600160a01b031633146107c65760405162461bcd60e51b815260206004820152601b60248201527f41646472657373206973206e6f7420746865206578656375746f72000000000060448201526064016103f9565b6000600282815481106107db576107db612846565b6000918252602091829020604080516101208101825260099390930290910180546001600160a01b03908116845282516060810184526001830180549283168252600160a01b90920460ff168187015260028301805495969395938701949193918401916108489061285c565b80601f01602080910402602001604051908101604052809291908181526020018280546108749061285c565b80156108c15780601f10610896576101008083540402835291602001916108c1565b820191906000526020600020905b8154815290600101906020018083116108a457829003601f168201915b505050919092525050508152604080516060810182526003840180546001600160a01b0381168352600160a01b900460ff1660208084019190915260048601805491909501949293919291840191906109199061285c565b80601f01602080910402602001604051908101604052809291908181526020018280546109459061285c565b80156109925780601f1061096757610100808354040283529160200191610992565b820191906000526020600020905b81548152906001019060200180831161097557829003601f168201915b505050919092525050508152600582015460209091019060ff1660048111156109bd576109bd6124bd565b60048111156109ce576109ce6124bd565b8152600682015460208201526007820154604082015260089091015460ff808216151560608085019190915261010083049091161515608080850191909152620100009092046001600160a01b031660a09093019290925282015190820151919250610a3991611a1c565b602080830151516001600160a01b031660009081526006909152604081208054909190610a679084906128ce565b92505081905550600060028260a0015181548110610a8757610a87612846565b906000526020600020906009020160080160016101000a81548160ff0219169083151502179055506001600a6000828254610ac291906128ce565b909155505060a08101516040519081527fb7f1dfe2f6ac6dcd488a08b928272e146948d54526bda95825333be1739e84309060200160405180910390a15050565b610b0b6114b5565b610b158382611a66565b610b20838383611c16565b50505050565b6001546001600160a01b03163314610b805760405162461bcd60e51b815260206004820152601b60248201527f41646472657373206973206e6f7420746865206578656375746f72000000000060448201526064016103f9565b81426007600060028481548110610b9957610b99612846565b600091825260209091206005600990920201015460ff166004811115610bc157610bc16124bd565b6004811115610bd257610bd26124bd565b8152602001908152602001600020546005600084815260200190815260200160002054610bff91906128e1565b10610c4c5760405162461bcd60e51b815260206004820152601460248201527f44434120496e74657276616c206e6f74206d657400000000000000000000000060448201526064016103f9565b60028381548110610c5f57610c5f612846565b906000526020600020906009020160080160019054906101000a900460ff16610cca5760405162461bcd60e51b815260206004820152601660248201527f5374726174656779206973206e6f74206163746976650000000000000000000060448201526064016103f9565b610cd48383611d86565b505050565b610ce16114b5565b6001600160a01b038216600090815260036020526040902054811115610d495760405162461bcd60e51b815260206004820152601760248201527f42616c616e6365206f6620746f6b656e20746f206c6f7700000000000000000060448201526064016103f9565b60405163a9059cbb60e01b8152336004820152602481018290526001600160a01b0383169063a9059cbb906044016020604051808303816000875af1158015610d96573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dba91906128f4565b506001600160a01b03821660009081526003602052604081208054839290610de39084906128ce565b90915550505050565b610df4612297565b60028281548110610e0757610e07612846565b6000918252602091829020604080516101208101825260099390930290910180546001600160a01b03908116845282516060810184526001830180549283168252600160a01b90920460ff16818701526002830180549596939593870194919391840191610e749061285c565b80601f0160208091040260200160405190810160405280929190818152602001828054610ea09061285c565b8015610eed5780601f10610ec257610100808354040283529160200191610eed565b820191906000526020600020905b815481529060010190602001808311610ed057829003601f168201915b505050919092525050508152604080516060810182526003840180546001600160a01b0381168352600160a01b900460ff166020808401919091526004860180549190950194929391929184019190610f459061285c565b80601f0160208091040260200160405190810160405280929190818152602001828054610f719061285c565b8015610fbe5780601f10610f9357610100808354040283529160200191610fbe565b820191906000526020600020905b815481529060010190602001808311610fa157829003601f168201915b505050919092525050508152600582015460209091019060ff166004811115610fe957610fe96124bd565b6004811115610ffa57610ffa6124bd565b8152600682015460208201526007820154604082015260089091015460ff80821615156060840152610100820416151560808301526201000090046001600160a01b031660a09091015292915050565b6110526114b5565b6002805460a08501819052308552600060e0860181905260018201835591909152835160099091027f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace810180546001600160a01b0393841673ffffffffffffffffffffffffffffffffffffffff1990911617815560208087015180517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf850180549383015160ff16600160a01b0274ffffffffffffffffffffffffffffffffffffffffff1990941691909616179190911784556040810151879492939192917f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad0019061115e908261295f565b5050506040828101518051600384018054602084015160ff16600160a01b0274ffffffffffffffffffffffffffffffffffffffffff199091166001600160a01b03909316929092179190911781559181015190919060048401906111c2908261295f565b505050606082015160058201805460ff191660018360048111156111e8576111e86124bd565b02179055506080820151600682015560a0820151600782015560c08201516008909101805460e08401516101009485015161ffff1990921693151561ff00191693909317921515909302919091177fffffffffffffffffffff0000000000000000000000000000000000000000ffff16620100006001600160a01b03909316929092029190911790558115611287576020830151516112879083611296565b8015610cd457610cd483611847565b61129e6114b5565b6040517f23b872dd000000000000000000000000000000000000000000000000000000008152336004820152306024820152604481018290526001600160a01b038316906323b872dd906064016020604051808303816000875af115801561130a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061132e91906128f4565b506001600160a01b03821660009081526003602052604081208054839290610de39084906128e1565b61135f6114b5565b6001600160a01b0382166000908152600460205260409020548111156113c75760405162461bcd60e51b815260206004820152601760248201527f42616c616e6365206f6620746f6b656e20746f206c6f7700000000000000000060448201526064016103f9565b60405163a9059cbb60e01b8152336004820152602481018290526001600160a01b0383169063a9059cbb906044016020604051808303816000875af1158015611414573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061143891906128f4565b506001600160a01b03821660009081526004602052604081208054839290610de39084906128ce565b6114696114b5565b6001600160a01b0381166114ac576040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600060048201526024016103f9565b61040b816119bf565b6000546001600160a01b03163314610733576040517f118cdaa70000000000000000000000000000000000000000000000000000000081523360048201526024016103f9565b60006002828154811061151057611510612846565b6000918252602091829020604080516101208101825260099390930290910180546001600160a01b03908116845282516060810184526001830180549283168252600160a01b90920460ff1681870152600283018054959693959387019491939184019161157d9061285c565b80601f01602080910402602001604051908101604052809291908181526020018280546115a99061285c565b80156115f65780601f106115cb576101008083540402835291602001916115f6565b820191906000526020600020905b8154815290600101906020018083116115d957829003601f168201915b505050919092525050508152604080516060810182526003840180546001600160a01b0381168352600160a01b900460ff16602080840191909152600486018054919095019492939192918401919061164e9061285c565b80601f016020809104026020016040519081016040528092919081815260200182805461167a9061285c565b80156116c75780601f1061169c576101008083540402835291602001916116c7565b820191906000526020600020905b8154815290600101906020018083116116aa57829003601f168201915b505050919092525050508152600582015460209091019060ff1660048111156116f2576116f26124bd565b6004811115611703576117036124bd565b8152600682015460208201526007820154604082015260089091015460ff808216151560608085019190915261010083049091161515608080850191909152620100009092046001600160a01b031660a0909301929092528201519082015191925061176e91611a1c565b602080830151516001600160a01b03166000908152600690915260408120805490919061179c9084906128ce565b90915550506008546040517f57b6e05b0000000000000000000000000000000000000000000000000000000081526001600160a01b03909116906357b6e05b906117ea9084906004016124f5565b6020604051808303816000875af1158015611809573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061182d91906128f4565b50600060028260a0015181548110610a8757610a87612846565b61185981608001518260600151611a1c565b602080830151516001600160a01b0316600090815260069091526040812080549091906118879084906128e1565b90915550506008546040517ffd4549dd0000000000000000000000000000000000000000000000000000000081526001600160a01b039091169063fd4549dd906118d59084906004016124f5565b6020604051808303816000875af11580156118f4573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061191891906128f4565b50600160028260a001518154811061193257611932612846565b906000526020600020906009020160080160016101000a81548160ff0219169083151502179055506001600a600082825461196d91906128e1565b909155505060a0810151600854604080519283526001600160a01b0390911660208301527feb939e0c9964841ca5615fd16a7ee72077352eaeae62d788a647076326a41abd910160405180910390a150565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060076000836004811115611a3457611a346124bd565b6004811115611a4557611a456124bd565b81526020019081526020016000205483611a5f91906128ac565b9392505050565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166024830152839160009183169063dd62ed3e90604401602060405180830381865afa158015611af0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b149190612a1f565b905082811015610b20576040517f095ea7b30000000000000000000000000000000000000000000000000000000081526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820185905283169063095ea7b3906044016020604051808303816000875af1158015611ba6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bca91906128f4565b610b205760405162461bcd60e51b815260206004820152600e60248201527f417070726f7665206661696c656400000000000000000000000000000000000060448201526064016103f9565b60408051610100810182526001600160a01b03858116825284166020820152600854600160a01b900462ffffff1691810191909152306060820152600090819060808101611c664261012c6128e1565b815260208082018690526000604080840182905260609384019190915280517f414bf38900000000000000000000000000000000000000000000000000000000815284516001600160a01b03908116600483015292850151831660248201529084015162ffffff16604482015291830151811660648301526080830151608483015260a083015160a483015260c083015160c483015260e0830151811660e48301529192507f00000000000000000000000000000000000000000000000000000000000000009091169063414bf38990610104016020604051808303816000875af1158015611d59573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d7d9190612a1f565b95945050505050565b600060028381548110611d9b57611d9b612846565b6000918252602091829020604080516101208101825260099390930290910180546001600160a01b03908116845282516060810184526001830180549283168252600160a01b90920460ff16818701526002830180549596939593870194919391840191611e089061285c565b80601f0160208091040260200160405190810160405280929190818152602001828054611e349061285c565b8015611e815780601f10611e5657610100808354040283529160200191611e81565b820191906000526020600020905b815481529060010190602001808311611e6457829003601f168201915b505050919092525050508152604080516060810182526003840180546001600160a01b0381168352600160a01b900460ff166020808401919091526004860180549190950194929391929184019190611ed99061285c565b80601f0160208091040260200160405190810160405280929190818152602001828054611f059061285c565b8015611f525780601f10611f2757610100808354040283529160200191611f52565b820191906000526020600020905b815481529060010190602001808311611f3557829003601f168201915b505050919092525050508152600582015460209091019060ff166004811115611f7d57611f7d6124bd565b6004811115611f8e57611f8e6124bd565b81526006820154602080830191909152600783015460408084019190915260089093015460ff8082161515606085015261010082041615156080808501919091526001600160a01b0362010000909204821660a090940193909352848201515185850151519386015191811660009081526003909352938220549495509293919290918291829110156120635760405162461bcd60e51b815260206004820152601460248201527f426173652042616c616e636520746f6f206c6f7700000000000000000000000060448201526064016103f9565b61ffff87161561208c57612080866020015187608001518961217c565b925061208c83866121d0565b82866080015161209c91906128ce565b91506120a88583611a66565b6120b3858584611c16565b6001600160a01b0385166000908152600460205260408120805492935083929091906120e09084906128e1565b909155505060808601516001600160a01b038616600090815260036020526040812080549091906121129084906128ce565b909155505060a0860151600090815260056020526040812042905560098054600192906121409084906128e1565b9091555050604051819089907fe4a7d2b149c52fdbb0a7ac58b4eac23900957e07caa30b4b1d0192223a1f740f90600090a35050505050505050565b600080600285602001516121909190612a38565b61219b90600a612b35565b6121a99061ffff8516612b44565b90508460200151600a6121bc9190612b35565b6121c68286612b44565b611d7d91906128ac565b60085460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018490529082169063a9059cbb906044016020604051808303816000875af1158015612223573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061224791906128f4565b6122935760405162461bcd60e51b815260206004820152601360248201527f466565207472616e73666572206661696c65640000000000000000000000000060448201526064016103f9565b5050565b60405180610120016040528060006001600160a01b031681526020016122e3604051806060016040528060006001600160a01b03168152602001600060ff168152602001606081525090565b8152604080516060808201835260008083526020838101919091529282015291019081526020016000815260006020820181905260408201819052606082018190526080820181905260a09091015290565b60006020828403121561234757600080fd5b5035919050565b80356001600160a01b038116811461236557600080fd5b919050565b60006020828403121561237c57600080fd5b611a5f8261234e565b60008060006060848603121561239a57600080fd5b6123a38461234e565b92506123b16020850161234e565b9150604084013590509250925092565b80356005811061236557600080fd5b6000602082840312156123e257600080fd5b611a5f826123c1565b600080604083850312156123fe57600080fd5b82359150602083013561ffff8116811461241757600080fd5b809150509250929050565b6000806040838503121561243557600080fd5b61243e8361234e565b946020939093013593505050565b6001600160a01b0381511682526000602060ff818401511681850152604083015160606040860152805180606087015260005b8181101561249b5782810184015187820160800152830161247f565b506000608082880101526080601f19601f830116870101935050505092915050565b634e487b7160e01b600052602160045260246000fd5b600581106124f157634e487b7160e01b600052602160045260246000fd5b9052565b6020815261250f6020820183516001600160a01b03169052565b6000602083015161012080604085015261252d61014085018361244c565b91506040850151601f1985840301606086015261254a838261244c565b925050606085015161255f60808601826124d3565b50608085015160a085015260a085015160c085015260c085015161258760e086018215159052565b5060e085015161010061259d8187018315159052565b909501516001600160a01b031693019290925250919050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156125ef576125ef6125b6565b60405290565b604051610120810167ffffffffffffffff811182821017156125ef576125ef6125b6565b604051601f8201601f1916810167ffffffffffffffff81118282101715612642576126426125b6565b604052919050565b60006060828403121561265c57600080fd5b6126646125cc565b905061266f8261234e565b815260208083013560ff8116811461268657600080fd5b82820152604083013567ffffffffffffffff808211156126a557600080fd5b818501915085601f8301126126b957600080fd5b8135818111156126cb576126cb6125b6565b6126dd601f8201601f19168501612619565b915080825286848285010111156126f357600080fd5b808484018584013760008482840101525080604085015250505092915050565b801515811461040b57600080fd5b803561236581612713565b60008060006060848603121561274157600080fd5b833567ffffffffffffffff8082111561275957600080fd5b90850190610120828803121561276e57600080fd5b6127766125f5565b61277f8361234e565b815260208301358281111561279357600080fd5b61279f8982860161264a565b6020830152506040830135828111156127b757600080fd5b6127c38982860161264a565b6040830152506127d5606084016123c1565b60608201526080830135608082015260a083013560a08201526127fa60c08401612721565b60c082015261280b60e08401612721565b60e0820152610100915061282082840161234e565b828201528095505050506020840135915061283d60408501612721565b90509250925092565b634e487b7160e01b600052603260045260246000fd5b600181811c9082168061287057607f821691505b60208210810361289057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000826128c957634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561071b5761071b612896565b8082018082111561071b5761071b612896565b60006020828403121561290657600080fd5b8151611a5f81612713565b601f821115610cd457600081815260208120601f850160051c810160208610156129385750805b601f850160051c820191505b8181101561295757828155600101612944565b505050505050565b815167ffffffffffffffff811115612979576129796125b6565b61298d81612987845461285c565b84612911565b602080601f8311600181146129c257600084156129aa5750858301515b600019600386901b1c1916600185901b178555612957565b600085815260208120601f198616915b828110156129f1578886015182559484019460019091019084016129d2565b5085821015612a0f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b600060208284031215612a3157600080fd5b5051919050565b60ff828116828216039081111561071b5761071b612896565b600181815b80851115612a8c578160001904821115612a7257612a72612896565b80851615612a7f57918102915b93841c9390800290612a56565b509250929050565b600082612aa35750600161071b565b81612ab05750600061071b565b8160018114612ac65760028114612ad057612aec565b600191505061071b565b60ff841115612ae157612ae1612896565b50506001821b61071b565b5060208310610133831016604e8410600b8410161715612b0f575081810a61071b565b612b198383612a51565b8060001904821115612b2d57612b2d612896565b029392505050565b6000611a5f60ff841683612a94565b808202811582820484141761071b5761071b61289656fea264697066735822122001e0c8f4da854a25ef3c66fa56a3c6d6e4d70193f0519020f58500ff887f4cf964736f6c63430008140033a2646970667358221220d6fd680775c546fa01d77756d45dc87955b38c8893b04096c86a92742aaa2e1264736f6c63430008140033";

type DCAFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DCAFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DCAFactory__factory extends ContractFactory {
  constructor(...args: DCAFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    executorAddress_: AddressLike,
    swapRouter_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      executorAddress_,
      swapRouter_,
      overrides || {}
    );
  }
  override deploy(
    executorAddress_: AddressLike,
    swapRouter_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      executorAddress_,
      swapRouter_,
      overrides || {}
    ) as Promise<
      DCAFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DCAFactory__factory {
    return super.connect(runner) as DCAFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DCAFactoryInterface {
    return new Interface(_abi) as DCAFactoryInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): DCAFactory {
    return new Contract(address, _abi, runner) as unknown as DCAFactory;
  }
}