<template>
	<view class="page">
		<view class="topper" v-if="status=='Active'">
			<image class="ic" src="../../images/dervice.png" mode="aspectFit"></image>
			<view class="id">{{cut_address}}</view>
		</view>
		<view class="topper" v-else>
			<image class="ic" src="../../images/dervice2.png" mode="aspectFit"></image>
			<view class="id">{{cut_address}}</view>
		</view>
		<view class="vbox">
			<view class="item" @click="openPopup">
				<image class="ic" src="../../images/se_1.png" mode="aspectFit"></image>
				<view class="tit">Total Reward</view>
				<view class="val">{{total_reward}}</view>
				<view class="iconfont icon-r"></view>
			</view>
			<view class="item">
				<image class="ic" src="../../images/se_4.png" mode="aspectFit"></image>
				<view class="tit">Total Consumed</view>
				<view class="val">{{total_consumed}}</view>
			</view>
			<view class="item">
				<image class="ic" src="../../images/se_2.png" mode="aspectFit"></image>
				<view class="tit">Location</view>
				<view class="val">{{location}}</view>
			</view>
			<view class="item">
				<image class="ic" src="../../images/se_3.png" mode="aspectFit"></image>
				<view class="tit">Status</view>
				<view class="val">{{status}}</view>
			</view>
			<view class="item">
				<image class="ic" src="../../images/tot.png" mode="aspectFit"></image>
				<view class="tit">TOT</view>
				<view class="val">{{tot}} Hours</view>
			</view>
			<view class="item">
				<image class="ic" src="../../images/cot.png" mode="aspectFit"></image>
				<view class="tit">COT</view>
				<view class="val">{{cot}} Hours</view>
			</view>
		</view>
		<uni-popup ref="popup">
			<view class="credits-popup popup">
				<view class="popup-hd">
					Rewards
					<view @click="closePopup" class="iconfont icon-guanbi"></view>
				</view>
				<scroll-view scroll-y="true" @scrolltolower="newpage" style="height: 600rpx;" class="bd">
					<view class="item" v-for="(item, index) in list">
						<view class="tit">{{item.typeName}}</view>
						<view class="status cgreen">Confirmed</view>
						<view class="date xs">#{{item.log_id}} {{DateFormat(item.timestamp)}}</view>
						<view class="rightbox">
							<view class="xs">{{fromWei(item.ifi_amount)}}</view>
							<view class="xs">HPC</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		deviceInfo,
		reward_list
	} from "@/request/serverV1.js"
	const Web3 = require('web3')
	let web3;
	export default {
		data() {
			return {
				user: [],
				cut_address: "",
				status: "Inactive",
				total_reward: 0,
				total_consumed: 0,
				location: "",
				tot: 0,
				cot: 0,
				pageIndex: 1,
				pageSize: 10,
				loading: false,
				list: [],
				total: 0
			};
		},
		async onLoad() {
			web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			try {
				const user = uni.getStorageSync("user")
				this.user = user
			} catch (e) {
				//TODO handle the exception
				uni.reLaunch({
					url: '../dam/set'
				});
			}
			const userCur = this.user[0]
			this.cut_address = userCur.address.substr(0, 15) + "....";
			const [err, res] = await deviceInfo({
				address: userCur.address
			})
			if (!res.data) return
			// this.status = res.data.status;
			// this.total_reward = web3.utils.fromWei(res.data.total_reward.toString(), 'ether');
			// this.total_consumed = web3.utils.fromWei(res.data.total_consumed.toString(), 'ether');
			// this.location = res.data.location;
			// this.tot = res.data.tot;
			// this.cot = res.data.cot;
			// this.reward_list();
		},
		onReady() {
			//this.openPopup();
		},
		methods: {
			openPopup() {
				this.$refs.popup.open('center');
			},
			closePopup() {
				this.$refs.popup.close()
			},
			newpage() {
				if (this.loading) return;
				this.pageIndex = this.pageIndex + 1;
				this.reward_list();
			},
			async reward_list() { //获取奖励列表
				this.loading = true;
				const [err, res] = await reward_list({
					address: this.user[0].address,
					pageNum: this.pageIndex,
					pageSize: this.pageSize
				})
				this.loading = false;
				if (err) return
				if (res.data.data.length > 0) {
					this.list = this.list.concat(res.data.data);
				} else {
					this.pageIndex = this.pageIndex - 1;
				}
			},
			DateFormat(ts) {
				if (!ts) return "";
				if (ts.length == 10) ts = ts + "000";
				var dt = new Date(parseInt(ts));
				var m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec");
				var mn = dt.getMonth();
				var day = dt.getDate();
				if (day < 10) day = '0' + day;
				var hour = dt.getHours();
				if (hour < 10) hour = '0' + hour;
				var minute = dt.getMinutes();
				if (minute < 10) minute = '0' + minute;
				return m[mn] + ' ' + day + ', ' + hour + ':' + minute;
			},
			fromWei(amount) {
				return web3.utils.fromWei(amount, 'ether');
			}
		},
		onNavigationBarButtonTap(e) {
			// .... CENCEL
		}
	};
</script>

<style lang="less">
	.page {
		padding: 37rpx 32rpx;
	}

	.popup {
		padding: 0 40rpx 60rpx;

		.item {
			position: relative;
			padding: 20rpx 0;
			.lb;

			.tit {
				font-size: 28rpx;
				color: #000;
			}

			.status {
				.cblue;
				font-size: 24rpx;
				margin: 6rpx 0;
			}

			.rightbox {
				.right;
				line-height: 1.7;
			}
		}
	}

	.topper {
		border-radius: 88rpx;
		background: #fff;
		height: 88rpx;
		margin-bottom: 40rpx;
		.fxc;

		.ic {
			.wh2(52);
			margin-right: 30rpx;
		}

		.id {
			font-size: 32rpx;
			color: #999;
		}
	}

	.vbox {
		padding: 30rpx 0;

		.item {
			.fx;
			padding: 20rpx 40rpx;

			.ic {
				.wh2(88);
				margin-right: 30rpx;
			}

			.id {
				font-size: 32rpx;
				color: #999;
			}

			.tit {
				.fg1;
				font-size: 28rpx;
			}

			.val {
				font-size: 24rpx;
				color: #999;
				//margin-right: 10rpx;
			}

			.iconfont {
				font-size: 28rpx;
				color: #999;
			}
		}
	}
</style>