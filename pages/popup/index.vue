<template>
	<view class="page">
		<uni-popup ref="popup">
			<view class="success-text">password changed successfully</view>
		</uni-popup>
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
		return {
			arr: ['Account 1', 'Account 2'],
			accountIndex: 0,
			showLoginOut: false
		};
	},
	onReady() {
		this.$refs.toast.open('center');
	},
	onLoad() {},
	methods: {
		
	},
	onNavigationBarButtonTap(e) {
		if (e.index) {
			this.$refs.popup.open();
		} else {
		}
	}
};
</script>

<style lang="less">
// @import url('css.less');
</style>
