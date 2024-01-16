<template>
	<view class="msg-popup popup">
		<view class="tit">Confirm to logout?</view>
		<view class="btns">
			<view @click="closePopup(0)" class="btn-item cancel">NO</view>
			<view @click="closePopup(1)" data-tag="1" class="btn-item">YES</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
	},
	data() {
		return {};
	},
	onReady() {},
	onLoad() {},
	methods: {
		closePopup(tag) {
			this.$emit('close',tag);
			if(tag){
				console.log("退出登陆");
			}
		}
	}
};
</script>

<style lang="less">
// @import url('css.less');
</style>
