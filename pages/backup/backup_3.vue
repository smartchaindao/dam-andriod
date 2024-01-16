<template>
	<view class="page">
		<view class="dam-hd full">Step 2: Create Secret Words</view>
		<view class="dam-txt">These are you Secret Words. Write them down on a piece of paper and you will be asked to reenter them in right order in next step.</view>
		<view class="dam-list dam-list-input">
			<view class="item" v-for="(item, index) in new_mnemonic_list" :key="index">
				{{ index + 1 }}.
				<input type="text" disabled="true" :value="item" @tap="del_item" :data-index="index" />
			</view>
		</view>
		<view class="dam-list">
			<view class="item" v-for="(item, index) in mnemonic_list" @tap="pick" :key="index" :data-index="index">{{ index + 1 }}. {{ item }}</view>
		</view>
		<view class="err" v-if="showTip">Wrong Words</view>
		<view @click="sureFunc" class="dam-vbtn">Done</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			showTip: false,
			mnemonic:"",
			mnemonic_list:[],
			new_mnemonic_list:['','','','','','','','','','','','']
		};
	},
	onLoad() {
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
		this.shuffle();
	},
	methods: {
		sureFunc() {
			if(this.mnemonic==this.new_mnemonic_list.join(" ")){
				uni.redirectTo({
				    url: '../setting/index'
				});
			} else {
				uni.showModal({
				    title: 'Tips',
				    content: "Wrong Words",
					showCancel:false
				});
			}
		},
		pick(e){
			var index=e.currentTarget.dataset.index;
			this.add_item(this.mnemonic_list[index]);
		},
		shuffle() {
		    var len = this.mnemonic_list.length;
		    for (var i = 0; i < len - 1; i++) {
		        var index = parseInt(Math.random() * (len - i));
		        var temp = this.mnemonic_list[index];
		        this.mnemonic_list[index] = this.mnemonic_list[len - i - 1];
		        this.mnemonic_list[len - i - 1] = temp;
		    }
		},
		add_item(word){
			for(var i=0;i<this.new_mnemonic_list.length;i++){
				if(this.new_mnemonic_list[i]==""){
					this.$set(this.new_mnemonic_list,i,word);
					break;
				}
			}
		},
		del_item(e){
			var index=e.currentTarget.dataset.index;
			this.$set(this.new_mnemonic_list,index,"");
		}
	}
};
</script>

<style lang="less">
</style>
