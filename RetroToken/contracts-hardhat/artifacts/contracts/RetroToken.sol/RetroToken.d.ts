// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface RetroToken$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "RetroToken",
  "sourceName": "contracts/RetroToken.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensBurned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b50336040518060400160405280600a81526020017f526574726f546f6b656e000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f52544b0000000000000000000000000000000000000000000000000000000000815250816003908161008d919061043d565b50806004908161009d919061043d565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036101125760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016101099190610550565b60405180910390fd5b6101218161012760201b60201c565b5061056b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061026e57607f821691505b60208210810361028157610280610227565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026102e97fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826102ac565b6102f386836102ac565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061033a6103356103308461030b565b610315565b61030b565b9050919050565b6000819050919050565b6103548361031f565b61036861036082610341565b8484546102b9565b825550505050565b600090565b61037d610370565b61038881848461034b565b505050565b5b818110156103ac576103a1600082610375565b60018101905061038e565b5050565b601f8211156103f1576103c281610287565b6103cb8461029c565b810160208510156103da578190505b6103ee6103e68561029c565b83018261038d565b50505b505050565b600082821c905092915050565b6000610414600019846008026103f6565b1980831691505092915050565b600061042d8383610403565b9150826002028217905092915050565b610446826101ed565b67ffffffffffffffff81111561045f5761045e6101f8565b5b6104698254610256565b6104748282856103b0565b600060209050601f8311600181146104a75760008415610495578287015190505b61049f8582610421565b865550610507565b601f1984166104b586610287565b60005b828110156104dd578489015182556001820191506020850194506020810190506104b8565b868310156104fa57848901516104f6601f891682610403565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061053a8261050f565b9050919050565b61054a8161052f565b82525050565b60006020820190506105656000830184610541565b92915050565b6113218061057a6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063715018a61161008c578063a0712d6811610066578063a0712d681461023b578063a9059cbb14610257578063dd62ed3e14610287578063f2fde38b146102b7576100ea565b8063715018a6146101f55780638da5cb5b146101ff57806395d89b411461021d576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806342966c68146101a957806370a08231146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102d3565b6040516101049190610f48565b60405180910390f35b61012760048036038101906101229190611003565b610365565b604051610134919061105e565b60405180910390f35b610145610388565b6040516101529190611088565b60405180910390f35b610175600480360381019061017091906110a3565b610392565b604051610182919061105e565b60405180910390f35b6101936103c1565b6040516101a09190611112565b60405180910390f35b6101c360048036038101906101be919061112d565b6103ca565b005b6101df60048036038101906101da919061115a565b610425565b6040516101ec9190611088565b60405180910390f35b6101fd61046d565b005b610207610481565b6040516102149190611196565b60405180910390f35b6102256104ab565b6040516102329190610f48565b60405180910390f35b6102556004803603810190610250919061112d565b61053d565b005b610271600480360381019061026c9190611003565b610598565b60405161027e919061105e565b60405180910390f35b6102a1600480360381019061029c91906111b1565b6105bb565b6040516102ae9190611088565b60405180910390f35b6102d160048036038101906102cc919061115a565b610642565b005b6060600380546102e290611220565b80601f016020809104026020016040519081016040528092919081815260200182805461030e90611220565b801561035b5780601f106103305761010080835404028352916020019161035b565b820191906000526020600020905b81548152906001019060200180831161033e57829003601f168201915b5050505050905090565b6000806103706106c8565b905061037d8185856106d0565b600191505092915050565b6000600254905090565b60008061039d6106c8565b90506103aa8582856106e2565b6103b5858585610777565b60019150509392505050565b60006012905090565b6103d4338261086b565b3373ffffffffffffffffffffffffffffffffffffffff167ffd38818f5291bf0bb3a2a48aadc06ba8757865d1dabd804585338aab3009dcb68260405161041a9190611088565b60405180910390a250565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6104756108ed565b61047f6000610974565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104ba90611220565b80601f01602080910402602001604051908101604052809291908181526020018280546104e690611220565b80156105335780601f1061050857610100808354040283529160200191610533565b820191906000526020600020905b81548152906001019060200180831161051657829003601f168201915b5050505050905090565b6105473382610a3a565b3373ffffffffffffffffffffffffffffffffffffffff167f3f2c9d57c068687834f0de942a9babb9e5acab57d516d3480a3c16ee165a42738260405161058d9190611088565b60405180910390a250565b6000806105a36106c8565b90506105b0818585610777565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b61064a6108ed565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106bc5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016106b39190611196565b60405180910390fd5b6106c581610974565b50565b600033905090565b6106dd8383836001610abc565b505050565b60006106ee84846105bb565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156107715781811015610761578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161075893929190611251565b60405180910390fd5b61077084848484036000610abc565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107e95760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016107e09190611196565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361085b5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108529190611196565b60405180910390fd5b610866838383610c93565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108dd5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016108d49190611196565b60405180910390fd5b6108e982600083610c93565b5050565b6108f56106c8565b73ffffffffffffffffffffffffffffffffffffffff16610913610481565b73ffffffffffffffffffffffffffffffffffffffff1614610972576109366106c8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016109699190611196565b60405180910390fd5b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610aac5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610aa39190611196565b60405180910390fd5b610ab860008383610c93565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610b2e5760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610b259190611196565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ba05760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b979190611196565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610c8d578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c849190611088565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ce5578060026000828254610cd991906112b7565b92505081905550610db8565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d71578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610d6893929190611251565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e015780600260008282540392505081905550610e4e565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610eab9190611088565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ef2578082015181840152602081019050610ed7565b60008484015250505050565b6000601f19601f8301169050919050565b6000610f1a82610eb8565b610f248185610ec3565b9350610f34818560208601610ed4565b610f3d81610efe565b840191505092915050565b60006020820190508181036000830152610f628184610f0f565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f9a82610f6f565b9050919050565b610faa81610f8f565b8114610fb557600080fd5b50565b600081359050610fc781610fa1565b92915050565b6000819050919050565b610fe081610fcd565b8114610feb57600080fd5b50565b600081359050610ffd81610fd7565b92915050565b6000806040838503121561101a57611019610f6a565b5b600061102885828601610fb8565b925050602061103985828601610fee565b9150509250929050565b60008115159050919050565b61105881611043565b82525050565b6000602082019050611073600083018461104f565b92915050565b61108281610fcd565b82525050565b600060208201905061109d6000830184611079565b92915050565b6000806000606084860312156110bc576110bb610f6a565b5b60006110ca86828701610fb8565b93505060206110db86828701610fb8565b92505060406110ec86828701610fee565b9150509250925092565b600060ff82169050919050565b61110c816110f6565b82525050565b60006020820190506111276000830184611103565b92915050565b60006020828403121561114357611142610f6a565b5b600061115184828501610fee565b91505092915050565b6000602082840312156111705761116f610f6a565b5b600061117e84828501610fb8565b91505092915050565b61119081610f8f565b82525050565b60006020820190506111ab6000830184611187565b92915050565b600080604083850312156111c8576111c7610f6a565b5b60006111d685828601610fb8565b92505060206111e785828601610fb8565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061123857607f821691505b60208210810361124b5761124a6111f1565b5b50919050565b60006060820190506112666000830186611187565b6112736020830185611079565b6112806040830184611079565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006112c282610fcd565b91506112cd83610fcd565b92508282019050808211156112e5576112e4611288565b5b9291505056fea2646970667358221220d4aa49721544a42fd95cd0940ff7e7ea8cba9e44318d2686597690df51e19a9c64736f6c634300081c0033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063715018a61161008c578063a0712d6811610066578063a0712d681461023b578063a9059cbb14610257578063dd62ed3e14610287578063f2fde38b146102b7576100ea565b8063715018a6146101f55780638da5cb5b146101ff57806395d89b411461021d576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806342966c68146101a957806370a08231146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102d3565b6040516101049190610f48565b60405180910390f35b61012760048036038101906101229190611003565b610365565b604051610134919061105e565b60405180910390f35b610145610388565b6040516101529190611088565b60405180910390f35b610175600480360381019061017091906110a3565b610392565b604051610182919061105e565b60405180910390f35b6101936103c1565b6040516101a09190611112565b60405180910390f35b6101c360048036038101906101be919061112d565b6103ca565b005b6101df60048036038101906101da919061115a565b610425565b6040516101ec9190611088565b60405180910390f35b6101fd61046d565b005b610207610481565b6040516102149190611196565b60405180910390f35b6102256104ab565b6040516102329190610f48565b60405180910390f35b6102556004803603810190610250919061112d565b61053d565b005b610271600480360381019061026c9190611003565b610598565b60405161027e919061105e565b60405180910390f35b6102a1600480360381019061029c91906111b1565b6105bb565b6040516102ae9190611088565b60405180910390f35b6102d160048036038101906102cc919061115a565b610642565b005b6060600380546102e290611220565b80601f016020809104026020016040519081016040528092919081815260200182805461030e90611220565b801561035b5780601f106103305761010080835404028352916020019161035b565b820191906000526020600020905b81548152906001019060200180831161033e57829003601f168201915b5050505050905090565b6000806103706106c8565b905061037d8185856106d0565b600191505092915050565b6000600254905090565b60008061039d6106c8565b90506103aa8582856106e2565b6103b5858585610777565b60019150509392505050565b60006012905090565b6103d4338261086b565b3373ffffffffffffffffffffffffffffffffffffffff167ffd38818f5291bf0bb3a2a48aadc06ba8757865d1dabd804585338aab3009dcb68260405161041a9190611088565b60405180910390a250565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6104756108ed565b61047f6000610974565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104ba90611220565b80601f01602080910402602001604051908101604052809291908181526020018280546104e690611220565b80156105335780601f1061050857610100808354040283529160200191610533565b820191906000526020600020905b81548152906001019060200180831161051657829003601f168201915b5050505050905090565b6105473382610a3a565b3373ffffffffffffffffffffffffffffffffffffffff167f3f2c9d57c068687834f0de942a9babb9e5acab57d516d3480a3c16ee165a42738260405161058d9190611088565b60405180910390a250565b6000806105a36106c8565b90506105b0818585610777565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b61064a6108ed565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106bc5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016106b39190611196565b60405180910390fd5b6106c581610974565b50565b600033905090565b6106dd8383836001610abc565b505050565b60006106ee84846105bb565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156107715781811015610761578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161075893929190611251565b60405180910390fd5b61077084848484036000610abc565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107e95760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016107e09190611196565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361085b5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108529190611196565b60405180910390fd5b610866838383610c93565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108dd5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016108d49190611196565b60405180910390fd5b6108e982600083610c93565b5050565b6108f56106c8565b73ffffffffffffffffffffffffffffffffffffffff16610913610481565b73ffffffffffffffffffffffffffffffffffffffff1614610972576109366106c8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016109699190611196565b60405180910390fd5b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610aac5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610aa39190611196565b60405180910390fd5b610ab860008383610c93565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610b2e5760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610b259190611196565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ba05760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b979190611196565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610c8d578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c849190611088565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ce5578060026000828254610cd991906112b7565b92505081905550610db8565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d71578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610d6893929190611251565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e015780600260008282540392505081905550610e4e565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610eab9190611088565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ef2578082015181840152602081019050610ed7565b60008484015250505050565b6000601f19601f8301169050919050565b6000610f1a82610eb8565b610f248185610ec3565b9350610f34818560208601610ed4565b610f3d81610efe565b840191505092915050565b60006020820190508181036000830152610f628184610f0f565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f9a82610f6f565b9050919050565b610faa81610f8f565b8114610fb557600080fd5b50565b600081359050610fc781610fa1565b92915050565b6000819050919050565b610fe081610fcd565b8114610feb57600080fd5b50565b600081359050610ffd81610fd7565b92915050565b6000806040838503121561101a57611019610f6a565b5b600061102885828601610fb8565b925050602061103985828601610fee565b9150509250929050565b60008115159050919050565b61105881611043565b82525050565b6000602082019050611073600083018461104f565b92915050565b61108281610fcd565b82525050565b600060208201905061109d6000830184611079565b92915050565b6000806000606084860312156110bc576110bb610f6a565b5b60006110ca86828701610fb8565b93505060206110db86828701610fb8565b92505060406110ec86828701610fee565b9150509250925092565b600060ff82169050919050565b61110c816110f6565b82525050565b60006020820190506111276000830184611103565b92915050565b60006020828403121561114357611142610f6a565b5b600061115184828501610fee565b91505092915050565b6000602082840312156111705761116f610f6a565b5b600061117e84828501610fb8565b91505092915050565b61119081610f8f565b82525050565b60006020820190506111ab6000830184611187565b92915050565b600080604083850312156111c8576111c7610f6a565b5b60006111d685828601610fb8565b92505060206111e785828601610fb8565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061123857607f821691505b60208210810361124b5761124a6111f1565b5b50919050565b60006060820190506112666000830186611187565b6112736020830185611079565b6112806040830184611079565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006112c282610fcd565b91506112cd83610fcd565b92508282019050808211156112e5576112e4611288565b5b9291505056fea2646970667358221220d4aa49721544a42fd95cd0940ff7e7ea8cba9e44318d2686597690df51e19a9c64736f6c634300081c0033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "RetroToken",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<RetroToken$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/RetroToken.sol:RetroToken",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<RetroToken$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "RetroToken",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<RetroToken$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/RetroToken.sol:RetroToken",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<RetroToken$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "RetroToken",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<RetroToken$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/RetroToken.sol:RetroToken",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<RetroToken$Type["abi"]>>;
}
