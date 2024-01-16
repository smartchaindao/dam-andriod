<template>
	<view class="page">
		<view class="sign-tit">Sign In</view>
		<image class="logo" src="../../images/logo.png" mode="aspectFit"></image>
		<view class="vbox">
			<view class="input-box">
				<view class="item">
					<view class="tip ">
						Password
						<image @click="togglePass" v-if="showPass" data-name="showPass" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
						<image @click="togglePass" v-else data-name="showPass" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					</view>
					<input v-if="!showPass" type="password" placeholder="Password" v-model="pwd" />
					<input v-else type="text" placeholder="Password" v-model="pwd" />
				</view>
				<view v-if="showTip" class="err">Wrong Password</view>
			</view>
			<view @click="login" class="vbtn">Login to DAM</view>
			<view @click="resetPopup" class="vbtn_l">Reset DAM</view>
		</view>
		<uni-popup ref="reset"> 
			<view class="popup reset-popup">
				<view class="hd">Reset DAM</view>
				<view class="bd">
					<view class="txt">Reset DAM will erase all Data Assets and acounts in this app.</view>					<view class="txt">You can recover wallet by using Mnemonics words and privary key. </view>				</view>
				<view @click="closePopup(1)" class="vbtn">I understand,continue</view>
				<view @click="closePopup(0)" class="vbtn_l">Cancel</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showPass: false,
			showTip: false,
			pwd:""
		};
	},
	onLoad() {},
	onReady() {
		
	},
	methods: {
		togglePass(e) {
			this[e.currentTarget.dataset.name] = !this[e.currentTarget.dataset.name];
		},
		resetPopup(){
			this.$refs.reset.open()
		},
		closePopup(tag){
			this.$refs.reset.close()
			if(tag){
				//uni.clearStorage();
				uni.removeStorageSync('is_login');
				uni.removeStorageSync('password');
				uni.removeStorageSync('user');
				uni.removeStorageSync('mnemonic');
				uni.removeStorageSync('logs');
				uni.reLaunch({url: '../dam/set'});
			}
		},
		login(){
			if(this.pwd==""){
				this.showTip=true;
				return;
			}
			var that=this;
			uni.getStorage({
			    key: 'password',
			    success: function (res) {
			        if(res.data!=that.pwd){
						that.showTip=true;
						return;
					}
					try {
					    uni.setStorageSync('is_login', "1");
					} catch (e) {
					    uni.showModal({
					        title: 'Error',
					        content: e.message,
					    	showCancel:false
					    });
					}
					uni.reLaunch({
					    url: '../home/index'
					});
			    },
				fail:function(){
					
				}
			});
		}
	}
};
</script>

<style lang="less">
.page {
	padding: 30rpx 34rpx 60rpx;
}
.sign-tit {
	text-align: center;
	font-size: 36rpx;
	text-transform: uppercase;
	.c;
	margin-bottom: 60rpx;
}
.logo {
	.wh(186, 165);
	margin: 0 auto 42rpx;
	display: block;
}
.vbtn {
	margin-bottom: 28rpx;
}
.input-box {
	margin-bottom: 38rpx;
}
.vbox {
	padding: 10rpx 40rpx 50rpx;
	.tip {
		font-size: 28rpx;
		padding: 26rpx 0 10rpx;
		position: relative;
	}
	input {
		.lb;
		height: 70rpx;
		margin-bottom: 20rpx;
		font-size: 20rpx;
	}
	.err {
		font-size: 20rpx;
		.cred;
	}
}
.eye {
	.wh2(50);
	.right;
	top: 60%;
}
.reset-popup{
	padding: 0 40rpx 60rpx;
	.c;
	.hd{
		text-align: center;
		height: 100rpx;
		line-height: 100rpx;
		font-size:32rpx;
	}
	.bd{
		font-size:28rpx;
		line-height: 1.5;
		padding-bottom: 80rpx;
		.txt{
			margin-bottom: 44rpx;
		}
	}
	.vbtn{
		margin-bottom:30rpx;
	}
}
</style>
