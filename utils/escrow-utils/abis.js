export const erc20 = [
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const escrow = [
  {
      "constant": true,
      "inputs": [],
      "name": "arbitratorExtraData",
      "outputs": [
          {
              "name": "",
              "type": "bytes"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "disputeIDtoTransactionID",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_disputeID",
              "type": "uint256"
          },
          {
              "name": "_ruling",
              "type": "uint256"
          }
      ],
      "name": "rule",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "timeOutByReceiver",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "arbitrator",
      "outputs": [
          {
              "name": "",
              "type": "address"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "payArbitrationFeeByReceiver",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "payArbitrationFeeBySender",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "appeal",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "transactions",
      "outputs": [
          {
              "name": "sender",
              "type": "address"
          },
          {
              "name": "receiver",
              "type": "address"
          },
          {
              "name": "amount",
              "type": "uint256"
          },
          {
              "name": "timeoutPayment",
              "type": "uint256"
          },
          {
              "name": "disputeId",
              "type": "uint256"
          },
          {
              "name": "senderFee",
              "type": "uint256"
          },
          {
              "name": "receiverFee",
              "type": "uint256"
          },
          {
              "name": "lastInteraction",
              "type": "uint256"
          },
          {
              "name": "status",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "getCountTransactions",
      "outputs": [
          {
              "name": "countTransactions",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          },
          {
              "name": "_evidence",
              "type": "string"
          }
      ],
      "name": "submitEvidence",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "feeTimeout",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_timeoutPayment",
              "type": "uint256"
          },
          {
              "name": "_receiver",
              "type": "address"
          },
          {
              "name": "_metaEvidence",
              "type": "string"
          }
      ],
      "name": "createTransaction",
      "outputs": [
          {
              "name": "transactionID",
              "type": "uint256"
          }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "executeTransaction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          },
          {
              "name": "_amount",
              "type": "uint256"
          }
      ],
      "name": "pay",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          }
      ],
      "name": "timeOutBySender",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_address",
              "type": "address"
          }
      ],
      "name": "getTransactionIDsByAddress",
      "outputs": [
          {
              "name": "transactionIDs",
              "type": "uint256[]"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_transactionID",
              "type": "uint256"
          },
          {
              "name": "_amountReimbursed",
              "type": "uint256"
          }
      ],
      "name": "reimburse",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "name": "_arbitrator",
              "type": "address"
          },
          {
              "name": "_arbitratorExtraData",
              "type": "bytes"
          },
          {
              "name": "_feeTimeout",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_metaEvidenceID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_evidence",
              "type": "string"
          }
      ],
      "name": "MetaEvidence",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_transactionID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_party",
              "type": "address"
          }
      ],
      "name": "Payment",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_transactionID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_party",
              "type": "uint8"
          }
      ],
      "name": "HasToPayFee",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_arbitrator",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "_evidenceGroupID",
              "type": "uint256"
          },
          {
              "indexed": true,
              "name": "_party",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "_evidence",
              "type": "string"
          }
      ],
      "name": "Evidence",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_arbitrator",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "_disputeID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_metaEvidenceID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_evidenceGroupID",
              "type": "uint256"
          }
      ],
      "name": "Dispute",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "_arbitrator",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "_disputeID",
              "type": "uint256"
          },
          {
              "indexed": false,
              "name": "_ruling",
              "type": "uint256"
          }
      ],
      "name": "Ruling",
      "type": "event"
  }
];

export const tokenEscrow = [
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "appeal",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
      {
        name: "_token",
        type: "address",
      },
      {
        name: "_timeoutPayment",
        type: "uint256",
      },
      {
        name: "_receiver",
        type: "address",
      },
      {
        name: "_metaEvidence",
        type: "string",
      },
    ],
    name: "createTransaction",
    outputs: [
      {
        name: "transactionIndex",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "pay",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "payArbitrationFeeByReceiver",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "payArbitrationFeeBySender",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
      {
        name: "_amountReimbursed",
        type: "uint256",
      },
    ],
    name: "reimburse",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_disputeID",
        type: "uint256",
      },
      {
        name: "_ruling",
        type: "uint256",
      },
    ],
    name: "rule",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
      {
        name: "_evidence",
        type: "string",
      },
    ],
    name: "submitEvidence",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "timeOutByReceiver",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_transactionID",
        type: "uint256",
      },
    ],
    name: "timeOutBySender",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_arbitrator",
        type: "address",
      },
      {
        name: "_arbitratorExtraData",
        type: "bytes",
      },
      {
        name: "_feeTimeout",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_transactionID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_party",
        type: "address",
      },
    ],
    name: "Payment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_transactionID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_party",
        type: "uint8",
      },
    ],
    name: "HasToPayFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_ruling",
        type: "uint256",
      },
    ],
    name: "Ruling",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_metaEvidenceID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_evidence",
        type: "string",
      },
    ],
    name: "MetaEvidence",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_metaEvidenceID",
        type: "uint256",
      },
      {
        indexed: false,
        name: "_evidenceGroupID",
        type: "uint256",
      },
    ],
    name: "Dispute",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        name: "_evidenceGroupID",
        type: "uint256",
      },
      {
        indexed: true,
        name: "_party",
        type: "address",
      },
      {
        indexed: false,
        name: "_evidence",
        type: "string",
      },
    ],
    name: "Evidence",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "arbitrator",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "arbitratorExtraData",
    outputs: [
      {
        name: "",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "disputeIDtoTransactionID",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTimeout",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCountTransactions",
    outputs: [
      {
        name: "countTransactions",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
    ],
    name: "getTransactionIDsByAddress",
    outputs: [
      {
        name: "transactionIDs",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "transactions",
    outputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "receiver",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "token",
        type: "address",
      },
      {
        name: "timeoutPayment",
        type: "uint256",
      },
      {
        name: "disputeId",
        type: "uint256",
      },
      {
        name: "senderFee",
        type: "uint256",
      },
      {
        name: "receiverFee",
        type: "uint256",
      },
      {
        name: "lastInteraction",
        type: "uint256",
      },
      {
        name: "status",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const arbitrator = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pinakion",
        "type": "address"
      }
    ],
    "name": "changePinakion",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RNBlock",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "disputesWithoutJurors",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "passPhase",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "governor",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lastDelayedSetStake",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "disputeStatus",
    "outputs": [
      {
        "name": "status",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "passPeriod",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "maxDrawingTime",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "currentRuling",
    "outputs": [
      {
        "name": "ruling",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "courts",
    "outputs": [
      {
        "name": "parent",
        "type": "uint96"
      },
      {
        "name": "hiddenVotes",
        "type": "bool"
      },
      {
        "name": "minStake",
        "type": "uint256"
      },
      {
        "name": "alpha",
        "type": "uint256"
      },
      {
        "name": "feeForJuror",
        "type": "uint256"
      },
      {
        "name": "jurorsForCourtJump",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "execute",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ALPHA_DIVISOR",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_voteIDs",
        "type": "uint256[]"
      },
      {
        "name": "_choice",
        "type": "uint256"
      },
      {
        "name": "_salt",
        "type": "uint256"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtMinStake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      }
    ],
    "name": "getSubcourt",
    "outputs": [
      {
        "name": "children",
        "type": "uint256[]"
      },
      {
        "name": "timesPerPeriod",
        "type": "uint256[4]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "appeal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "onTransfer",
    "outputs": [
      {
        "name": "allowed",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "disputes",
    "outputs": [
      {
        "name": "subcourtID",
        "type": "uint96"
      },
      {
        "name": "arbitrated",
        "type": "address"
      },
      {
        "name": "numberOfChoices",
        "type": "uint256"
      },
      {
        "name": "period",
        "type": "uint8"
      },
      {
        "name": "lastPeriodChange",
        "type": "uint256"
      },
      {
        "name": "drawsInRound",
        "type": "uint256"
      },
      {
        "name": "commitsInRound",
        "type": "uint256"
      },
      {
        "name": "ruled",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      }
    ],
    "name": "changeSubcourtTimesPerPeriod",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtJurorFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtAlpha",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_voteIDs",
        "type": "uint256[]"
      },
      {
        "name": "_commit",
        "type": "bytes32"
      }
    ],
    "name": "castCommit",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RN",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RNGenerator",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_destination",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "executeGovernorProposal",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_minStakingTime",
        "type": "uint256"
      }
    ],
    "name": "changeMinStakingTime",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "NON_PAYABLE_AMOUNT",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_stake",
        "type": "uint128"
      }
    ],
    "name": "setStake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "executeRuling",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "name": "_voteID",
        "type": "uint256"
      }
    ],
    "name": "getVote",
    "outputs": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "commit",
        "type": "bytes32"
      },
      {
        "name": "choice",
        "type": "uint256"
      },
      {
        "name": "voted",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_RNGenerator",
        "type": "address"
      }
    ],
    "name": "changeRNGenerator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "executeDelayedSetStakes",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      },
      {
        "name": "_subcourtID",
        "type": "uint96"
      }
    ],
    "name": "stakeOf",
    "outputs": [
      {
        "name": "stake",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtJurorsForJump",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "appealPeriod",
    "outputs": [
      {
        "name": "start",
        "type": "uint256"
      },
      {
        "name": "end",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "phase",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MAX_STAKE_PATHS",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "delayedSetStakes",
    "outputs": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "subcourtID",
        "type": "uint96"
      },
      {
        "name": "stake",
        "type": "uint128"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lastPhaseChange",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "minStakingTime",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "nextDelayedSetStake",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_numberOfChoices",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "createDispute",
    "outputs": [
      {
        "name": "disputeID",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "drawJurors",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_parent",
        "type": "uint96"
      },
      {
        "name": "_hiddenVotes",
        "type": "bool"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      },
      {
        "name": "_sortitionSumTreeK",
        "type": "uint256"
      }
    ],
    "name": "createSubcourt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "getJuror",
    "outputs": [
      {
        "name": "subcourtIDs",
        "type": "uint96[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "onApprove",
    "outputs": [
      {
        "name": "allowed",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "jurors",
    "outputs": [
      {
        "name": "stakedTokens",
        "type": "uint256"
      },
      {
        "name": "lockedTokens",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_maxDrawingTime",
        "type": "uint256"
      }
    ],
    "name": "changeMaxDrawingTime",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "getDispute",
    "outputs": [
      {
        "name": "votesLengths",
        "type": "uint256[]"
      },
      {
        "name": "tokensAtStakePerJuror",
        "type": "uint256[]"
      },
      {
        "name": "totalFeesForJurors",
        "type": "uint256[]"
      },
      {
        "name": "votesInEachRound",
        "type": "uint256[]"
      },
      {
        "name": "repartitionsInEachRound",
        "type": "uint256[]"
      },
      {
        "name": "penaltiesInEachRound",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      }
    ],
    "name": "getVoteCounter",
    "outputs": [
      {
        "name": "winningChoice",
        "type": "uint256"
      },
      {
        "name": "counts",
        "type": "uint256[]"
      },
      {
        "name": "tied",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "changeGovernor",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MIN_JURORS",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "appealCost",
    "outputs": [
      {
        "name": "cost",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "proxyPayment",
    "outputs": [
      {
        "name": "allowed",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lockInsolventTransfers",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "arbitrationCost",
    "outputs": [
      {
        "name": "cost",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "pinakion",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_governor",
        "type": "address"
      },
      {
        "name": "_pinakion",
        "type": "address"
      },
      {
        "name": "_RNGenerator",
        "type": "address"
      },
      {
        "name": "_minStakingTime",
        "type": "uint256"
      },
      {
        "name": "_maxDrawingTime",
        "type": "uint256"
      },
      {
        "name": "_hiddenVotes",
        "type": "bool"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      },
      {
        "name": "_sortitionSumTreeK",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_phase",
        "type": "uint8"
      }
    ],
    "name": "NewPhase",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_period",
        "type": "uint8"
      }
    ],
    "name": "NewPeriod",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_subcourtID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_stake",
        "type": "uint128"
      },
      {
        "indexed": false,
        "name": "_newTotalStake",
        "type": "uint256"
      }
    ],
    "name": "StakeSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_voteID",
        "type": "uint256"
      }
    ],
    "name": "Draw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_tokenAmount",
        "type": "int256"
      },
      {
        "indexed": false,
        "name": "_ETHAmount",
        "type": "int256"
      }
    ],
    "name": "TokenAndETHShift",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "DisputeCreation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "AppealPossible",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "AppealDecision",
    "type": "event"
  }
];