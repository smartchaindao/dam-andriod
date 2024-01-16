<template>
	<view class="page">
		<view class="dam-hd full">Step 1: Confirm with your Password</view>
		<view class="dam-bd">
			<view class="tip">Please enter your password to continue</view>
			<input type="text" />
			<view v-if="showTip" class="err">Wrong Password</view>
			<view class="dam-vbtn">Confirm</view>
		</view>
		
	</view>
</template>
<script>
export default {
	data() {
		return {
			showTip: !false
		};
	},
	onLoad() {},
	methods: {}
};
</script>
<style lang="less">


</style>
