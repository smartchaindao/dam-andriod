import Vue from 'vue'
import App from './App'
// import store from './store/index.js'
import {app_config} from '@/request/serverV1.js'
Vue.config.productionTip = false

Vue.prototype.eth_url = 'http://15.165.192.191:18545';//http://18.216.66.9:8545';//'http://18.183.82.121:8545';//http://18.163.112.243:8545
Vue.prototype.contract_address = '';//"0xB1F052E948A63b1c560D569BBd8501B6B6D0690a";//"0x8FA5073D71798574dE9a6aeB469De83671a580c2";//0x4D2f63d6826603B84D12C1C7dd33aB7F3BDe7553
Vue.prototype.gas = 0;
Vue.prototype.gasLimit = 0;
Vue.prototype.gasPrice = -1;
var that=this;
Vue.prototype.$get_config = async (option)=>{
	const [err,res]=await app_config()//获取区块链配置，加载到全局变量
	Vue.prototype.eth_url = res.data.rpcUrl||Vue.prototype.eth_url;
	Vue.prototype.contract_address = res.data.contract||Vue.prototype.contract_address;
	Vue.prototype.gas = res.data.gas;
	Vue.prototype.gasLimit = res.data.gasLimit;
	Vue.prototype.gasPrice = res.data.gasPrice;
}
Vue.prototype.mytouchend=function(){
	console.log("mytouchend");
	uni.setStorageSync('op_time', Date.now());
}

App.mpType = 'app'

const app = new Vue({
    ...App,
	// store
})
app.$mount()
