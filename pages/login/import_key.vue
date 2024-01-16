<template>
	<view class="page">
		<view class="dam-hd full">Import by Private Key</view>
		<view class="dam-txt">Please setup password for your DAM</view>
		<view class="form">
			<view class="item">
				<view class="tip">Private Key
					<image @click="togglePass" v-if="showPass" data-name="showPass" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					<image @click="togglePass" v-else data-name="showPass" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
				</view>		
				<view class="info">
					<view class="iconfont icon-xiangji ricon" @tap="scan"></view>
					<textarea class="key-txt" v-if="!showPass" v-model="keys" auto-height />
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
				<input v-if="!showPass2" type="password" placeholder="Password" v-model="pwd1" />
				<input v-else type="text" placeholder="Password" v-model="pwd1"  />
			</view>
			<view class="item">
				<view class="tip">Confirm Password</view>
				<input v-if="!showPass2" type="password" placeholder="Password" v-model="pwd2" />
				<input v-else type="text" placeholder="Password" v-model="pwd2" />
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
export default {
	data() {
		return {
			showPass:false,
			showPass2:false,
			showTip:false,
			tip_text:"",
			agree: false,
			keys:"",
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
			if(this.keys==""){
				this.tip_text="Private Key cannot be empty";
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
			if(this.keys.length!=66){
				if(this.keys.length==64&&this.keys.indexOf("0x")!=0){
					this.keys="0x"+this.keys;
				}
				else {
					this.tip_text="Wrong Private Key";
					this.showTip=true;
					return;
				}
			}
			let web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			let account = web3.eth.accounts.privateKeyToAccount(this.keys);
			var user=[{"privateKey":account.privateKey,"publicKey":account.publicKey,"address":account.address,"name":"Account 1"}];
			try {
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
					that.keys=res.result;
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
		    this.keys=this.keys.replace(/(^\s*)|(\s*$)/g, "");
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
