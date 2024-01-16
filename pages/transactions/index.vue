<template>
	<view class="page">
		<view class="header-box">
			<view class="item left">
				<view class="tit">Total Sent:</view>
				<view class="tit">{{Sent}} HPC</view>
			</view>
			<view class="item right">
				<view class="tit">Total Received</view>
				<view class="tit">{{Received}} HPC</view>
			</view>
		</view>
		<view class="list">
			<view @click="showInfo" :data-index="index" class="item" v-for="(item, index) in logs" :key="index">
				<view class="tit">Sent</view>
				<view
					:class="[{ desc:item.status=='Submitted',cgreen: item.status == 'Confirmed', cred: item.status == 'Failed' }]">
					{{item.status}}
				</view>
				<view class="date">#{{item.nonce}} {{DateFormat(item.cdate)}}</view>
				<view class="unit">{{item.amount}} HPC</view>
			</view>
		</view>
		<uni-popup ref="popup" :maskClick="true">
			<view class="popup">
				<view class="hd">
					Sent HPC
					<view @click="closePopup" class="iconfont icon-guanbi"></view>
				</view>
				<view class="bd" v-if="logs.length>0">
					<view class="row">
						Status
						<view class="val">{{logs[log_index].status}}</view>
					</view>
					<view class="row">
						Date
						<view class="val">{{DateFormat(logs[log_index].cdate)}}</view>
					</view>
					<view class="row">
						From
						<view class="val">{{cutAddress(logs[log_index].from)}}</view>
					</view>
					<view class="row">
						To
						<view class="val">{{cutAddress(logs[log_index].to)}}</view>
					</view>
					<view class="row">
						Nonce
						<view class="val">#{{logs[log_index].nonce}}</view>
					</view>
					<view class="row">
						Amount
						<view class="val">{{logs[log_index].amount}} HPC</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		trans
	} from "@/request/serverV1.js"
	const Web3 = require('web3')
	let web3;
	export default {
		data() {
			return {
				user: [],
				logs: [],
				log_index: 0,
				Sent: 0,
				Received: 0
			};
		},
		async onLoad() {
			web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			try {
				this.user = uni.getStorageSync("user")
			} catch (e) {
				//TODO handle the exception
				uni.reLaunch({
					url: '../dam/set'
				});
			}
			const [err, res] = await trans({
				address: this.user[0].address,
			})
			this.Sent = (parseFloat(res.data.sent) + 0.000001).toFixed(5);
			this.Received = (parseFloat(res.data.received) + 0.000001).toFixed(5);
			this.logs = uni.getStorageSync('logs');
		},
		onReady() {
			//this.showInfo()
		},
		methods: {
			showInfo(e) {
				this.log_index = e.currentTarget.dataset.index;
				this.$refs.popup.open();
			},
			closePopup() {
				this.$refs.popup.close();
			},
			DateFormat(ts) {
				if (!ts) return "";
				var dt = new Date(ts);
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
			cutAddress(address) {
				if (address == "") return "";
				return address.substr(0, 8) + '......' + address.substr(address.length - 4);
			}
		}
	};
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.list {
		.pwrap;
		.lt;
	}

	.item {
		position: relative;
		font-size: 26rpx;
		padding: 14rpx 0;
		.lb;

		.tit {
			font-size: 28rpx;
		}

		.desc {
			.cblue;
			margin: 2px 0;
		}

		.date {
			color: #999;
		}

		.unit {
			color: #999;
			.right;
		}
	}

	.popup {
		padding: 0 40rpx 10rpx;

		.hd {
			height: 106rpx;
			line-height: 106rpx;
			position: relative;
			text-align: center;
			font-size: 34rpx;

			.iconfont {
				.right(10rpx);
				font-size: 24rpx;
				color: #666;
			}
		}

		.row {
			.lt;
			height: 82rpx;
			position: relative;
			font-size: 28rpx;
			line-height: 82rpx;

			.val {
				.right;
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.header-box {
		position: relative;

		.item {
			padding-left: 15px;
			padding-right: 15px;
		}

		.right {
			position: absolute;
			top: 0;
			right: 0;
		}
	}
</style>