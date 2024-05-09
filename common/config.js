let config;
// 主网开发
// config={
// 	baseUrl:"http://3.25.238.18",
// 	rpc_url:"http://15.165.192.191:18545"
// }

// // 本地测试
config={
	// baseUrl:"https://api.prod.smartchainai.info:31829",
	baseUrl:"http://api.pre.smartchainai.info:31638",	
	"rpcUrl": "http://15.165.192.191:18545",
	"chainId": "18888",
	"contracts": {
	        // "WUSDT": "0x4d82a5dddd3ffa95f6c265782eccb46b561de637",
	        // "Vault": "0x6b3bb933be134a6bec7881f10ae4bb5d1decc4f9",
	        // "Vesting": "0x8d26c3867b34259ff823978b212bb984f87db3b1"
	    }
	
}

// 生产
// config={
// 	baseUrl:"http://prod.smartchainai.info/api",
// 	rpc_url:"http://13.212.22.227:1666"
// }

// 主网正式环境
// config={
// 	baseUrl:"http://57.181.64.183",
// 	rpc_url:"http://13.212.22.227:1666"
// }

export default config