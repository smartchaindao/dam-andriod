<template>
	<view class="page">
		<view class="main">
			<view class="title">Setup your DAM</view>
			<view class="desc">Import an existing DAM or create a new one</view>
			<image class="ic" src="../../images/dam2.png" mode="aspectFit"></image>
			<view class="btns">
				<navigator class="vbtn_l" url="../login/import_word">Import using Mnemonics</navigator>
				<navigator class="vbtn_l" url="../login/import_key">Import using Private Key</navigator>
				<navigator class="vbtn" url="../login/login">Create a new DAM</navigator>
			</view>
		</view>
		<uni-popup ref="toast">
			<view class="popup toast-popup">
				<image class="ic" src="../../images/suc.png" mode="aspectFit"></image>
				<view class="txt">delete  successfully</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onReady() {
		
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="less">
page {
	background: #fff;
}

.page {
	text-align: center;
}
.main{
	
	.title {
		font-size: 36rpx;
		text-transform: uppercase;
		margin-bottom: 20rpx;
		padding-top: 60rpx;
	}
	.desc {
		font-size: 20rpx;
		color: #999;
		line-height: 1.56;
		text-transform: uppercase;
		margin-bottom: 65rpx;
	}
	.ic {
		.wh(451, 369);
	}
	
	.btns {
		width: 606rpx;
		margin: 120rpx auto 0;
	}
	
	.vbtn_l {
		margin: 0 auto 40rpx;
	}
}
</style>
