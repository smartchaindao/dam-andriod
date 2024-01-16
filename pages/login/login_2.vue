<template>
	<view class="page">
		<view class="dam-hd full">Step 2: Create Secret Words</view>
		<view class="dam-txt">
			<view class="txt">Use Secret Words to better secure you Data Assets</view>
			<view class="txt">It is very important to keep your secret words in a secure place.</view>
			<view class="txt">We recommand you copy the words to a piece of paper and don't recommand you keep them online in any forms.</view>
		</view>
		<view class="dam-bd">
			<view class="dam-bd-tip">Please enter your password to continue</view>
			<view class="item">
				<input type="password" placeholder="Password" v-model="pwd" @blur="valid_pwd"/>
			</view>
			<view class="err" v-if="showTip">Wrong Password</view>
			<view @click="sureFunc" class="vbtn">Create Secret Works</view>
		</view>

		<uni-popup ref="popup"><view class="success-text">password changed successfully</view></uni-popup>
	</view>
</template>

<script>
	const bip39 = require('bip39')
export default {
	data() {
		return {
			showTip: false,
			pwd:""
		};
	},
	onLoad() {
		
	},
	methods: {
		sureFunc() {
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
					const mnemonic = bip39.generateMnemonic();
					try {
					    uni.setStorageSync('mnemonic', mnemonic);
					} catch (e) {
					    uni.showModal({
					        title: 'Error',
					        content: e.message,
					    	showCancel:false
					    });
					}
					uni.navigateTo({
					    url: 'login_2_1'
					});
			    },
				fail:function(){
					
				}
			});
			//this.$refs.popup.open('bottom');
		},
		valid_pwd(){
			if(this.pwd==""){
				this.showTip=true;
				return;
			}
			this.showTip=false;
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
</style>
