<template>
	<view class="page">
		<view class="dam-hd">This new password will unlock you DAM</view>
		<view class="dam-bd">
			<view class="item">
				<view class="tip ">
					New Password
					<image @click="togglePass" v-if="showPass" data-name="showPass" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					<image @click="togglePass" v-else data-name="showPass" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
				</view>
				<input v-if="!showPass" type="password" placeholder="Password" v-model="pwd1"  />
				<input v-else type="text" placeholder="Password" v-model="pwd1" />
			</view>
			<view class="item">
				<view class="tip ">
					Confirm Password
					<image @click="togglePass" v-if="showPass2" data-name="showPass2" class="eye" src="../../images/eye2.png" mode="aspectFit"></image>
					<image @click="togglePass" v-else data-name="showPass2" class="eye" src="../../images/eye.png" mode="aspectFit"></image>
				</view>
				<input v-if="!showPass2" type="password" placeholder="Password" v-model="pwd2" />
				<input v-else type="text" placeholder="Password" v-model="pwd2"  />
			</view>
			<view class="dam-supply">Must be at lease 8 characters</view>
			<view v-if="showTip" class="err">Password is too short. (at least 8 characters)</view>
			<view v-if="showTip2" class="err">Passwords don't match.</view>
			<view @click="agreeFunc" :class="['agree-box', { active: agree }]">I understand that this password cannot recover my account from a different devics.</view>
			<view @click="sureFunc" class="dam-vbtn">Change Password</view>
		</view>

		<uni-popup ref="popup"><view class="success-text">password changed successfully</view></uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTip: false,
			showTip2: false,
			showPass: false,
			showPass2: false,
			agree: false,
			pwd1:"",
			pwd2:""
		};
	},
	onLoad() {
	},
	methods: {
		togglePass(e) {
			this[e.currentTarget.dataset.name] = !this[e.currentTarget.dataset.name];
		},
		agreeFunc() {
			this.agree = !this.agree;
		},
		sureFunc() {
			//this.$refs.popup.open('bottom');
			if(this.pwd1.length<8){
				this.showTip2=false;
				this.showTip=true;
				return;
			}
			if(this.pwd1!=this.pwd2){
				this.showTip=false;
				this.showTip2=true;
				return;
			}
			if(!this.agree){
				return;
			}
			try {
			    uni.setStorageSync('password', this.pwd1);
			} catch (e) {
			    uni.showModal({
			        title: 'Error',
			        content: e.message,
			    	showCancel:false
			    });
			}
			uni.showModal({
			    title: 'Tips',
			    content: "password changed successfully",
				showCancel:false,
				success: function (res) {
					if (res.confirm) {
						uni.redirectTo({
						    url: '../setting/index'
						});
					}
				}
			});
		},
		valid_pwd(){
			if(this.pwd1.length<8){
				this.showTip2=false;
				this.showTip=true;
				return;
			}
			if(this.pwd1!=this.pwd2){
				this.showTip=false;
				this.showTip2=true;
				return;
			}
			this.showTip=false;
			this.showTip2=false;
		}
	}
};
</script>

<style lang="less">
	.dam-supply {
		margin-bottom: 30rpx;
	}
</style>
