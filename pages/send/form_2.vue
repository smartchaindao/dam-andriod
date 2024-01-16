<template>
	<view class="page">
		<view class="form">
			<view class="item">
				<view class="tip">
					Product
					<text class="cred">*</text>
					:
				</view>
				<view  class="select">
					DAM Android
					<view class="iconfont icon-d"></view>
				</view>
			</view>
			<view class="item">
				<view class="tip">
					Email
					<text class="cred">*</text>
					:
				</view>
				<input type="text" placeholder="" />
			</view>
			<view v-if="showTip" class="err">Please input email Wrong email format</view>
			<view class="item">
				<view class="tip">
					Subject
					<text class="cred">*</text>
					:
				</view>
				<input type="text" placeholder="" />
			</view>
			<view v-if="showTip" class="err">Please input subject</view>
			<view class="item">
				<view class="tip">
					Subject
					<text class="cred">*</text>
					:
				</view>
				<textarea name="" id="" cols="30" rows="10"></textarea>
			</view>
			<view v-if="showTip" class="err">Please input description</view>
			<view @click="sureFunc" class="dam-vbtn">Submit</view>
		</view>

		<uni-popup ref="popup"><view class="success-text">password changed successfully</view></uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTip: true
		};
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="less">
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
.form {
	.vbox;
	margin: 30rpx 30rpx 0;
	padding: 0 40rpx 40rpx;
	.tip {
		font-size: 28rpx;
		padding: 26rpx 0 20rpx;
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
		height: 60rpx;
		font-size: 20rpx;
	}
	
}
.err {
	margin-top: 10rpx;
}

textarea {
	.wh(604, 258);
	background: #f2f2f2;
	border-radius: 10rpx;
	padding: 20rpx;
	.bbox;
	margin-top: 10rpx;
}
</style>
