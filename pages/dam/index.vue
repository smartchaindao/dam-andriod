<template>
	<view class="page">
		<view class="title">Welcome to SmartChain DAM</view>
		<view class="txt">
			<p>A secure Data Assets Manager opening</p>
			<p>the world of SmartChain network</p>
			<p>available to all</p>
		</view>
		<image class="ic" src="../../images/dam1.png" mode="aspectFit"></image>
		<view class="vbtn" @tap="goto">get Started</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {
	},
	methods: {
		goto(){
			uni.setStorageSync('first',"1");
			uni.reLaunch({url: '/pages/dam/set'});
		}
	}
};
</script>

<style lang="less">
page {
	background: #fff;
}
.page{
	text-align: center;
}
.title{
	font-size:36rpx;
	text-transform: uppercase;
	margin-bottom:20rpx;
	padding-top: 60rpx;
}
.txt{
	font-size:20rpx;
	color:#999;
	line-height: 1.56;
	text-transform: uppercase;
	margin-bottom:65rpx;
}
.ic{
	.wh(576,594);
}

.vbtn{
	width: 606rpx;
	margin:114rpx auto 0;
	text-transform:capitalize
}
</style>
