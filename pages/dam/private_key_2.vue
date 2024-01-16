<template>
	<view class="page">
		<view class="vbox">
			<view class="box">
				<view class="title">Text</view>
				<view class="desc">This is your private key, do not show it to anyone</view>
				<view class="key" @tap="copy">
					{{private_key}}
				</view>
			</view>
			<view class="box">
				<view class="title">QR Code</view>
				<uv-qrcode ref="qrcode"  size="244px" :value="private_key"
					style="margin: 30rpx auto;"></uv-qrcode>
			</view>
		</view>
		<uni-popup ref="popup">
			<view class="popup">
				<image class="ic" src="../../images/suc.png" mode="aspectFit"></image>
				<view class="txt">
					Private Key Copied
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				private_key: "",
			};
		},
		onReady() {
			var user = null;
			try {
				user = uni.getStorageSync('user');
			} catch (e) {
				uni.showModal({
					title: 'Error',
					content: e.message,
					showCancel: false
				});
			}
			if (user == null) {
				uni.reLaunch({
					url: '../dam/set'
				});
			}
			this.private_key = user[0].privateKey;
		},
		onLoad() {

		},
		methods: {
			copy() {
				var that = this;
				uni.setClipboardData({
					data: this.private_key,
					success: function() {
						uni.hideToast();
						//uni.showToast({
						//    title: 'Content copied',
						//    duration: 2000
						//});
						//console.log('success');
						that.$refs.popup.open('center');
					}
				});
			}
		}
	};
</script>

<style lang="less">
	.vbox {
		margin: 30rpx 30rpx 0;
		padding: 40rpx;
	}

	.box+.box {
		margin-top: 42rpx;
	}

	.box {
		.title {
			font-size: 32rpx;
			margin-bottom: 6rpx;
			font-weight: bold;
		}

		.desc {
			color: #999;
			margin-bottom: 35rpx;
			font-size: 24rpx;
		}
	}

	.key {
		background-color: #f2f2f2;
		border-radius: 20rpx;
		padding: 20rpx 50rpx;
		font-size: 20rpx;
		word-wrap: break-word;
		text-align: center;
		line-height: 1.8;
	}

	.info-list {
		display: flex;
		flex-wrap: wrap;
		background-color: #f2f2f2;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 20rpx 30rpx;

		.item {
			width: 33.3%;
			font-size: 24rpx;
			line-height: 2.8;
		}
	}

	.code {
		.wh2(502);
		display: block;
		margin: 30rpx auto 0;
	}

	.popup {
		width: 300rpx;
		text-align: center;
		height: 300rpx;
		padding: 20rpx 40rpx;
		.fyc;

		.ic {
			.wh2(66);
			display: block;
			margin: 0 auto 20rpx;
		}

		.txt {
			font-size: 32rpx;
			line-height: 1.3;
			font-weight: bold;
		}
	}
</style>