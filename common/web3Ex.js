import {
	app_config
} from '@/request/serverV1.js'
import config from "./config.js"
const Web3 = require('web3')
const ethers = require('ethers');


const vaultAbi = [{
	"inputs": [{
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		},
		{
			"internalType": "address",
			"name": "token",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "opType",
			"type": "uint256"
		}
	],
	"name": "addLiquidity",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, ]

class initWeb {
	web3
	config
	wusdtContract
	vaultContract
	provider
	ethers
	vaultAbi = [{
		"inputs": [{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "opType",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}, ]
	wusdtAbi = [{
			"inputs": [{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}],
			"name": "balanceOf",
			"outputs": [{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}],
			"stateMutability": "view",
			"type": "function"
		}, {
			"inputs": [{
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
			"outputs": [{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [{
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
			"outputs": [{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}],
			"stateMutability": "view",
			"type": "function"
		},
	]
	constructor() {
		this.ethers=ethers
		this.Web3=Web3
	}
	async init() {
		await this.web3Init()
		this.initContract()
	}
	async web3Init() {
		const [err, res] = await app_config()
		if (err) {
			this.config = config
		} else {
			this.config = res.data
		}
		this.web3 = new Web3(new Web3.providers.HttpProvider(this.config.rpcUrl));
		this.provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);
	}
	initContract() {
		this.wusdtContract = new this.web3.eth.Contract(this.wusdtAbi, this.config.contracts.WUSDT)
		this.vaultContract = new this.web3.eth.Contract(this.vaultAbi, this.config.contracts.Vault)
		console.log(this.vaultContract, "this.vaultContract")
	}


}

export default initWeb