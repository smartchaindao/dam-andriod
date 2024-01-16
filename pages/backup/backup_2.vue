<template>
	<view class="page">
		<view class="dam-hd full">Step 2: Create Secret Words</view>
		<view class="dam-txt">These are you Secret Words. Write them down on a piece of paper and you will be asked to reenter them in right order in next step.</view>
		<view class="dam-list">
			<view class="item" v-for="(item, index) in mnemonic_list">{{ index + 1 }}. {{ item }}</view>
		</view>
		<view @click="sureFunc" class="dam-vbtn">Continue</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			mnemonic_list:[]
		};
	},
	onLoad() {
		try {
		    var mnemonic=uni.getStorageSync('mnemonic');
			this.mnemonic_list=mnemonic.split(" ");
		} catch (e) {
		    uni.showModal({
		        title: 'Error',
		        content: e.message,
		    	showCancel:false
		    });
		}
	},
	methods: {
		sureFunc() {
			if(this.mnemonic_list.length!=12){
				uni.showModal({
				    title: 'Error',
				    content: "Mnemonic not found",
					showCancel:false
				});
				return;
			}
			uni.navigateTo({
			    url: 'backup_3'
			});
		}
	}
};
</script>

<style lang="less">

</style>
