<template>
	<view class="page">
		<view class="dam-hd full">Import by Secret Words</view>
		<view class="dam-txt">Please setup password for your DAM</view>
		<view class="form">
			<view class="item">
				<view class="tip">Secret Words
					<image @click="togglePass" v-if="showPass" data-name="showPass" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					<image @click="togglePass" v-else data-name="showPass" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
				</view>		
				<view class="info">
					<view class="iconfont icon-xiangji ricon" @tap="scan"></view>
					<textarea class="key-txt" v-if="!showPass" v-model="words" auto-height />
					<view class="key-txt" v-else>
						**********
					</view>
				</view>
			</view>
			<view class="item">
				<view class="tip ">
					New Password:
					<image @click="togglePass" v-if="!showPass2" data-name="showPass2" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					<image @click="togglePass" v-else data-name="showPass2" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
					
				</view>
				<input v-if="!showPass2" type="password" placeholder="Password"  v-model="pwd1"/>
				<input v-else type="text" placeholder="Password"  v-model="pwd1"/>
			</view>
			<view class="item">
				<view class="tip">Confirm Password</view>
				<input v-if="!showPass2" type="password" placeholder="Password" v-model="pwd2"/>
				<input v-else type="text" placeholder="Password" v-model="pwd2"/>
			</view>
			<view class="dam-supply">Must be at lease 8 characters</view>
			<view v-if="showTip" class="err">{{tip_text}}</view>
			<view @click="agreeFunc" :class="['agree-box', { active: agree }]">I understand that this password cannot recover my account from a different devics.</view>
			<view @click="importFunc" class="dam-vbtn">Import Account</view>
		</view>
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
			showPass:false,
			showPass2:false,
			showTip:false,
			tip_text:"",
			agree: false,
			words:"",
			pwd1:"",
			pwd2:""
		};
	},
	onLoad() {
		//h5.screen.lockOrientation('default');
	},
	methods: {
		togglePass(e) {
			this[e.currentTarget.dataset.name] = !this[e.currentTarget.dataset.name];
		},
		agreeFunc() {
			this.agree = !this.agree;
		},
		importFunc(){
			this.Trim();
			if(this.words==""){
				this.tip_text="Secret Words cannot be empty";
				this.showTip=true;
				return;
			}
			if(this.pwd1.length<8){
				this.tip_text="Password is too short. (at least 8 characters)";
				this.showTip=true;
				return;
			}
			if(this.pwd1!=this.pwd2){
				this.tip_text="Passwords don't match.";
				this.showTip=true;
				return;
			}
			if(!this.agree){
				return;
			}
			if(this.words.split(" ").length!=12){
				this.tip_text="Wrong Secret Words";
				this.showTip=true;
				return;
			}
			if(!bip39.validateMnemonic(this.words)){
				this.tip_text="Wrong Secret Words";
				this.showTip=true;
				return;
			}
			let seedBuffer = bip39.mnemonicToSeedSync(this.words,"");
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
				uni.setStorageSync('mnemonic', this.words);
				uni.setStorageSync('password', this.pwd1);
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
			//console.log(account);
			//let wallet = web3.eth.accounts.wallet.add(account);
			//console.log(wallet);
			uni.reLaunch({
			    url: '../home/index'
			});
		},
		scan(){
			var that=this;
			uni.scanCode({
			    success: function (res) {
			        console.log('条码类型：' + res.scanType);
			        console.log('条码内容：' + res.result);
					that.words=res.result;
			    }
			});
		},
		valid_pwd(){
			if(this.pwd1.length<8){
				this.tip_text="Wrong Password";
				this.showTip=true;
				return;
			}
			if(this.pwd1!=this.pwd2){
				this.tip_text="Passwords don't match";
				this.showTip=true;
				return;
			}
			this.showTip=false;
			this.tip_text="";
		},
		Trim(){   
		    this.words=this.words.replace(/(^\s*)|(\s*$)/g, "");
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
.form {
	.vbox;
	margin: 0 30rpx 0;
	padding: 0 40rpx 40rpx;
	.tip {
		font-size: 28rpx;
		padding: 26rpx 0 10rpx;
		position: relative;
		.ricon {
			.xs;
			.right;
		}
		.iconfont {
			font-size: 40rpx;
		}
	}
	input {
		.lb;
		height: 70rpx;
		margin-bottom: 20rpx;
		font-size: 20rpx;
	}
	.err {
		margin-bottom: 36rpx;
	}
}
.err {	
	margin-top: -10rpx;
}

.key-txt{
	word-wrap: break-word;
	font-size:20rpx;
	width: 460rpx;
	min-height: 100rpx;
	
	line-height: 30rpx;
}
.info{
	position: relative;
	padding-bottom: 14rpx;	margin-top: 20rpx;
	.lb;
	.iconfont{
		color: #999;
		position: absolute;
		right: 4rpx;
		top: -8rpx;
		font-size:40rpx;
	}
}
</style>
