<template>
	<view class="page">
		<view class="vbox">
			<view class="box">
				<view class="title">Text</view>
				<view class="desc">These are your mnemonics words.</view>
				<view class="info-list" @tap="copy">
					<view class="item" v-for="(item, index) in mnemonic_list" :key="index">{{ index + 1 }}. {{ item }}</view>
				</view>
			</view>
			<view class="box">
				<view class="title">QR Code</view>
				<image class="code" src="../../images/code.png" mode="aspectFit" v-if="false"></image>
				<canvas class='code qrcode-canvas' canvas-id='qrcode' v-if="true"></canvas>
			</view>
		</view>
		<uni-popup ref="toast">
			<view class="popup toast-popup">
				<image class="ic" src="../../images/suc.png" mode="aspectFit"></image>
				<view class="txt">
					Secret Words Copied
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	let QRCode = require('@/common/qrcode.js').default;
export default {
	data() {
		return {
			mnemonic:"",
			mnemonic_list:[],
			QR: ''
		};
	},
	onReady() {
		//this.$refs.toast.open("center")
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
		let qrcode = new QRCode('qrcode', {
			text: this.mnemonic,
			width: 251,
			height: 251,
			colorDark: '#000000',
			colorLight: '#fff',
			correctLevel: QRCode.correctLevel.H,
			successTips: false
		});
		this.QR = qrcode;
	},
	onLoad() {},
	methods: {
		copy(){
			var that=this;
			uni.setClipboardData({
			    data: this.mnemonic,
			    success: function () {
					uni.hideToast();
					//uni.showToast({
					//    title: 'Secret Words Copied',
					//    duration: 2000
					//});
			        //console.log('success');
					that.$refs.toast.open("center");
			    }
			});
		}
	}
};
</script>

<style lang="less">
	.vbox{
		margin: 30rpx 30rpx 0;
		padding: 40rpx;
	}
	.box + .box{
		margin-top:42rpx;
	}
	.box{
		.title{
			font-size:28rpx;
			margin-bottom:6rpx;
			font-weight: bold;
		}
		.desc{
			color:#999;
			margin-bottom:35rpx;
		}
	}
	.info-list{
		display: flex;
		flex-wrap: wrap;
		background-color:#f2f2f2;
		border-radius:20rpx;
		padding: 20rpx 20rpx 20rpx 30rpx;
		.item{
			width: 33.3%;
			font-size:20rpx;
			line-height: 2.8;
		}
	}
	.code{
		.wh2(502);
		display: block;
		margin:30rpx auto 0;
	}
	
</style>
