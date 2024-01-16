<template>
	<view class="page">
		<view class="dam-hd full">Step 3: Confirm Secret Words</view>
		<view class="dam-txt">
			Select each words in the right order.
		</view>
		<view class="dam-list dam-list-input">
			<view class="item" v-for="(item, index) in new_mnemonic_list" :key="index">
				{{ index + 1 }}.
				<input type="text" disabled="true" :value="item" @tap="del_item" :data-index="index" />
			</view>
		</view>
		<view class="info-list">
			<view class="item" v-for="(item, index) in mnemonic_list" @tap="pick" :key="index" :data-index="index">{{ index + 1 }}. {{ item }}</view>
		</view>
		<view class="err" v-if="showTip">Wrong Words</view>
		<view @click="sureFunc" class="dam-vbtn">Done</view>

	</view>
</template>

<script>
	const Web3 = require('web3')
	const bip39 = require('bip39')
	const {hdkey} = require('ethereumjs-wallet')
	const util = require('ethereumjs-util')
export default {
	data() {
		return {
			showTip: false,
			mnemonic:"",
			mnemonic_list:[],
			new_mnemonic_list:['','','','','','','','','','','','']
		};
	},
	onLoad() {
		try {
		    this.mnemonic=uni.getStorageSync('mnemonic');
			console.log(this.mnemonic);
			this.mnemonic_list=this.mnemonic.split(" ");
		} catch (e) {
		    uni.showModal({
		        title: 'Error',
		        content: e.message,
		    	showCancel:false
		    });
		}
		this.shuffle();
	},
	methods: {
		sureFunc() {
			if(this.mnemonic==this.new_mnemonic_list.join(" ")){
				let seedBuffer = bip39.mnemonicToSeedSync(this.mnemonic,"");
				let hdWallet = hdkey.fromMasterSeed(seedBuffer);
				let key = hdWallet.derivePath("m/44'/60'/0'/0/0");
				//从keypair中获取私钥
				let privateKey = util.bufferToHex(key._hdkey._privateKey);
				//从keypair中获取公钥
				let publicKey = util.bufferToHex(key._hdkey._publicKey);
				//使用keypair中的公钥生成地址
				let address = util.pubToAddress(key._hdkey._publicKey, true);
				address = util.toChecksumAddress("0x"+address.toString('hex'));
				var user=[{"privateKey":privateKey,"publicKey":publicKey,"address":address,"name":"Account 1"}];
				try {
				    uni.setStorageSync('user', user);
					uni.setStorageSync('is_login', "1");
				} catch (e) {
				    uni.showModal({
				        title: 'Error',
				        content: e.message,
				    	showCancel:false
				    });
				}
				let web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
				let account = web3.eth.accounts.privateKeyToAccount(privateKey);
				uni.navigateTo({
				    url: '../home/index'
				});
			} else {
				uni.showModal({
				    title: 'Tips',
				    content: "Wrong Words",
					showCancel:false
				});
			}
		},
		pick(e){
			var index=e.currentTarget.dataset.index;
			this.add_item(this.mnemonic_list[index]);
		},
		shuffle() {
		    var len = this.mnemonic_list.length;
		    for (var i = 0; i < len - 1; i++) {
		        var index = parseInt(Math.random() * (len - i));
		        var temp = this.mnemonic_list[index];
		        this.mnemonic_list[index] = this.mnemonic_list[len - i - 1];
		        this.mnemonic_list[len - i - 1] = temp;
		    }
		},
		add_item(word){
			for(var i=0;i<this.new_mnemonic_list.length;i++){
				if(this.new_mnemonic_list[i]==""){
					this.$set(this.new_mnemonic_list,i,word);
					break;
				}
			}
		},
		del_item(e){
			var index=e.currentTarget.dataset.index;
			this.$set(this.new_mnemonic_list,index,"");
		},
		onNavigationBarButtonTap() {
		    uni.reLaunch({
		    	url:"../dam/index"
		    });
		}
	}
};
</script>
<style lang="less">
@import url('css.less');

.err{
	padding-left: 70rpx;
	position: relative; top: -20rpx;
}
</style>
