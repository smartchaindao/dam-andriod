<template>
	<view class="page">
		<view class="box">
			<view class="hd">Security</view>
			<view class="bd">
				<navigator v-if="!no_mnemonic" class="vbtn_l" url="../backup/backup_1">Backup Secret Words</navigator>
				<navigator v-if="!no_mnemonic" class="vbtn_l" url="../reveal/reveal_secret_words">Reveal Secret Words</navigator>
				<navigator class="vbtn_l" url="../change_password/change_password_1">Change Password</navigator>
			</view>
		</view>
		<view class="box">
			<view class="hd">Auto-lock</view>
			<view class="tip">Change the amount of time before DAM automatically locks</view>
			<view @click="openLock" class="select">
				{{autoLock_text}}
				<view class="iconfont icon-d"></view>
			</view>
		</view>
		<view class="box">
			<view class="hd">Show Private Key</view>
			<view class="bd">
				<navigator class="vbtn_l" url="../dam/private_key">Show Private Key</navigator>
			</view>
		</view>
		<view class="box">
			<view class="hd">About</view>
			<view class="bd">
				<view class="vbtn_l">Privacy Policy</view>
				<view class="vbtn_l">Terms of Use</view>
				<view class="vbtn_l">Contact Us</view>
			</view>
		</view>
		<view class="box">
			<view class="hd">Logout</view>
			<view class="bd"><view @click="logoutFunc" class="vbtn">Logout</view></view>
		</view>

		<uni-popup ref="logout" :animation="true">
			<loginOut @close="closeLoginOut"></loginOut>
		</uni-popup>
		<uni-popup ref="success"><view class="success-text">set auto-lock time successfuily</view></uni-popup>
		<uni-popup ref="lock">
			<view class="lock-popup popup">
				<view class="title">Auto-lock</view>
				<view class="list">
					<view @click="clickLock" v-for="(item,index) in autoLockList" :key="index" :data-index="index" class="item">{{item.text}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import loginOut from '../popup/loginout.vue';
	var app=getApp();
export default {
	components:{loginOut},
	data() {
		return {
			autoLockList:[{value:10,text:"After 10 seconds"},{value:15,text:"After 15 seconds"},{value:20,text:"After 20 seconds"},{value:30,text:"After 30 seconds"},{value:60,text:"After 60 seconds"},{value:120,text:"After 2 minutes"},{value:300,text:"After 5 minutes"},{value:600,text:"After 10 minutes"},{value:"",text:"Never"}],
			autoLock_text:"Never",
			autoLock_value:"",
			no_mnemonic:true
		};
	},
	onLoad() {
		var that=this;
		uni.getStorage({
		    key: 'mnemonic',
		    success: function (res) {
		        //console.log(res.data);
				if(res.data!=""){
					that.no_mnemonic=false;
				}
		    },
			fail:function(err){
				//console.log("mnemonic",err);
			}
		});
		uni.getStorage({
		    key: 'autoLock',
		    success: function (res) {
				if(res.data){
					that.autoLock_text=res.data.text;
					that.autoLock_value=res.data.value;
				}
		    },
			fail:function(err){
				//console.log("autoLock",err);
			}
		});
	},
	onReady() {
		//this.logoutFunc();
		//this.openLock();
	},
	methods: {
		logoutFunc() {
			this.$refs.logout.open();
		},
		closeLoginOut(tag){
			this.$refs.logout.close();
			if(tag){
				// 退出登陆
				uni.setStorageSync('is_login', "0");
				uni.reLaunch({url: '../login/sign'});
			}
		},
		closePopup(e) {
			this.$refs.logout.close();
			if (e.currentTarget.dataset.tag) {
				//退出登陆
				uni.showToast({
					title: '退出登陆'
				});
			}
		},
		openLock(){
			//this.$refs.lock.open();
		},
		clickLock(e){
			this.$refs.lock.close();
			var index=e.target.dataset.index;
			this.autoLock_text=this.autoLockList[index].text;
			this.autoLock_value=this.autoLockList[index].value;
			//存到本地
			uni.setStorageSync('autoLock',this.autoLockList[index]);
			uni.setStorageSync('autoSecond',this.autoLock_value);
			if(this.autoLock_value==""){
				app.globalData.autoLockOff();
			}
			else{
				app.globalData.autoLockOn();
			}
			
			//this.$refs.success.open('bottom');
		}
	}
};
</script>

<style lang="less">
page {
	background: #fff;
	padding: 30rpx 34rpx 60rpx;
	box-sizing: border-box;
}
.page {
	.c;
}
.select {
	border-radius: 10rpx;
	border: 1px solid #ccc;
	height: 66rpx;
	line-height: 66rpx;
	padding-left: 30rpx;
	.xs;
	position: relative;
	.iconfont {
		.right(20rpx);
	}
}
.lock-popup {
	padding: 40rpx;
	.title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.item {
		line-height: 2.4;
		text-align: left;
	}
}
.vbtn,.vbtn_l{
	.hh(70);
}
.vbtn_l {
	margin-bottom: 40rpx;
	.c;
	border-color: @b;
}
.box {
	margin-bottom: 40rpx;
}
.hd {
	font-size: 32rpx;
	.c;
	margin-bottom: 20rpx;
	position: relative;
	padding-left: 28rpx;
	line-height: 1.8;
	font-weight: bold;
	&::before {
		content: '';
		display: block;
		position: absolute;
		.wh(6, 28);
		.bgc;
		border-radius: 3rpx;
		.centery;
		left: 0;
	}
}
.tip {
	.xs;
	margin-bottom: 30rpx;
	position: relative;
	margin-top: -20rpx;
}
.vbtn,
.vbtn_l {
	font-size: 24rpx;
}
</style>
