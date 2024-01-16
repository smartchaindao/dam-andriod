// import Vue from "vue"
// import Vuex from "vuex"

// // 2. 将 Vuex 安装为 Vue 的插件
// Vue.use(Vuex)
// const Web3 = require('web3')
// // 3. 创建 Store 的实例对象
// const store = new Vuex.Store({
// 	state: () => ({
// 		user: uni.getStorageSync("user"),
// 		userCur: 0,
// 		blance: "0",
// 		web3: null,
// 		// 默认的rpc路径
// 		rpc_url:"http://15.165.192.191:18545"
// 	}),
	
// 	// 模块的 mutations 方法
// 	mutations: {
// 		// 设置用户
// 		async setUser(state, user) {
// 			state.user = user
// 			uni.setStorageSync("user", user)
// 		},
// 		// 获取配置并设置web3对象
// 		async setWeb3(state) {
// 			var [err, res] = await uni.request({
// 				url: 'http://3.25.238.18/dam/app_config',
// 				method: "POST",
// 				data: {}
// 			}); 
// 			// 后端返回就
// 			state.rpc_url=res.data.rpc_url||state.rpc_url
// 			//获取区块链配置，加载到全局变量
// 			const web3= new Web3(new Web3.providers.HttpProvider(state.rpc_url));
// 			state.web3=web3
// 			console.log(web3)
// 		},
// 		// 获取余额
// 		async getBlance(state){
// 			const userCur=state.user[state.userCur]
// 			const blance=await state.web3.eth.getBalance(userCur.address)
// 			state.blance==state.web3.utils.fromWei(blance,"ether")
// 		}
// 	},
	
// 	// 模块的 actions 方法
// 	actions: {
		
// 	},
	
// 	// 模块的 getters 属性
// 	getters: {
// 		getWeb3(){
// 			return state.web3
// 		}
		
// 	}
// })

// // 向外共享 Store 的实例对象
// export default store