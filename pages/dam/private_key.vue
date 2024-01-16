<template>
	<view class="page">
		<view class="dam-hd ">Step 1: Confirm with your Password</view>
		<view class="dam-bd">
			<view class="tip">Please enter your password to continue</view>
			<input type="password" v-model="pwd" />
			<view v-if="showTip" class="err">Wrong Password</view>
			<view class="dam-vbtn" @tap="check">Confirm</view>
		</view>
		
	</view>
</template>
<script>
export default {
	data() {
		return {
			showTip: false,
			pwd:""
		};
	},
	onLoad() {},
	methods: {
		check(){
			if(this.pwd==""){
				this.showTip=true;
				return;
			}
			var that=this;
			uni.getStorage({
			    key: 'password',
			    success: function (res) {
			        if(res.data!=that.pwd){
						that.showTip=true;
						return;
					}
					uni.redirectTo({
					    url: 'private_key_2'
					});
			    },
				fail:function(){
					
				}
			});
		}
	}
};
</script>
<style lang="less">

</style>
