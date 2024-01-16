<template>
	<view class="page">
		<view class="select-box">
			<image class="logo" src="../../images/logo3.png" mode="aspectFit"></image>
			<picker mode="selector" :range="userList" @change="changeAccount" range-key="name" disabled="true">
				Account
				<text class="iconfont icon-d" v-if="false"></text>
			</picker>
			<view class="str" @tap="successFunc">{{cut_address}}</view>
		</view>
		<view class="datas-box">
			<image class="bg" src="../../images/bg.png" mode="aspectFill"></image>
			<view class="content">
				<view class="hd">
					Total assets
					<text class="iconfont icon-eye" v-if="false"></text>
				</view>
				<view class="bd">
					<view class="val">{{blance.substr(0,18)}}</view>
					<view class="unit">HPC</view>
				</view>
			</view>
		</view>
		<view class="nav-box">
			<view @click="openReceive" class="item">
				<image class="ic" src="../../images/ic_a1.png" mode="aspectFit"></image>
				<view class="val">Receive</view>
			</view>
			<navigator hover-class="none" url="../send/form" class="item">
				<image class="ic" src="../../images/ic_a2.png" mode="aspectFit"></image>
				<view class="val">Send</view>
			</navigator>
			<navigator hover-class="none" url="../transactions/index" class="item">
				<image class="ic" src="../../images/ic_a3.png" mode="aspectFit"></image>
				<view class="val">Trans</view>
			</navigator>
			<view hover-class="none" @tap="toDevice" class="item" :style="{'opacity':has_device?'1':'0.5'}">
				<image class="ic" src="../../images/ic_a4.png" mode="aspectFit"></image>
				<view class="val">Device</view>
			</view>
		</view>
		<view class="list-box">
			<view class="hd">
				<view class="txt">Assets</view>
			</view>
			<view class="bd" style="padding-bottom: ;">
				<view class="val">{{blance}} HPC</view>
			</view>
			<view class="bd" v-if="false">
				<navigator url="" hover-class="none" class="item" v-for="(item,index) in 3" :key="index">
					<image class="logo" src="../../images/logo2.png" mode="aspectFit"></image>
					<view class="info">
						<view class="tit">HPC:6370.0010</view>
						<view class="desc">≈$34.079.9863</view>
					</view>
					<view class="iconfont icon-r"></view>
				</navigator>
			</view>
		</view>
		<uni-popup ref="logout" :animation="true">
			<loginOut @close="closeLoginOut"></loginOut>
		</uni-popup>
		<uni-popup ref="receive" background-color="#fff">
			<view class="popup-content">
				<view class="bottom-popup">
					<div class="top"></div>
					<div class="content">
						<div class="tit">Receive</div>
						<uv-qrcode ref="qrcode" v-if="userList.length" size="144px"
							:value="userList[accountIndex].address" style="margin: 0 auto;"></uv-qrcode>
						<div class="tip">Scan address to receive payment</div>
						<div @click="successFunc" class="vbtn_l">{{cut_address}}</div>
					</div>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="success">
			<view class="success-text">transaction#0 successfully,view transaction details</view>
		</uni-popup>
		<uni-popup ref="waiting">
			<view class="success-text waiting-text">
				<image class="ic" src="../../images/loading.gif" mode="aspectFit"></image>
				<div class="txt">transaction #0 submitted, waiting for confirmation</div>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import loginOut from '../popup/loginout.vue';
	import {
		mapState
	} from 'vuex'
	import {
		check_device,
		deviceInfo
	} from "@/request/serverV1.js"
	const Web3 = require('web3')
	let web3;
	export default {
		components: {
			loginOut
		},
		data() {
			return {
				userList: [],
				accountIndex: 0,
				showLoginOut: false,
				cut_address: "",
				blance: "",
				has_device: false
			};
		},
		computed: {

		},
		async onLoad() {
			if (!this.eth_url) {
				await this.$get_config();
			}
			const user = uni.getStorageSync("user")
			if (!user.length) {
				uni.reLaunch({
					url: "/pages/dam/index"
				})
				return
			}
			this.userList = user
			const userCur = this.userList[this.accountIndex]
			this.cut_address = userCur.address.substr(0, 15) + "....";
			web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			const blance = await web3.eth.getBalance(userCur.address)
			this.blance = web3.utils.fromWei(blance, "ether")
			const [err, res] = await deviceInfo({
				address: userCur.address
			})
			// 默认没有数据就是没有设备
			if (!res.data) return
			this.has_device = true
		},
		async onPullDownRefresh() {
			const userCur = this.userList[this.accountIndex]
			const blance = await web3.eth.getBalance(userCur.address)
			this.blance = web3.utils.fromWei(blance, "ether")

			uni.stopPullDownRefresh()
		},

		onPageScroll() {
			console.log(onPageScroll);
		},
		methods: {
			changeAccount(e) { //切换账户
				this.accountIndex = e.detail.value;
				this.cut_address = this.userList[this.accountIndex].address.substr(0, 15) + "....";
				web3.eth.getBalance(this.userList[this.accountIndex].address).then(function(result) {
					console.log("getBalance", result);
					that.blance = result;
				});
			},
			closePopup(e) {
				this.$refs.logout.close();
				if (e.currentTarget.dataset.tag) {
					//退出登陆
					uni.showToast({
						title: '退出登陆'
					});
				}
			},
			closeLoginOut(tag) {
				this.$refs.logout.close();
				if (tag) {
					// 退出登陆
					uni.setStorageSync('is_login', "0");
					uni.reLaunch({
						url: '../login/sign'
					});
				}
			},
			openReceive() { //打开Receive二维码
				//this.cut_address=this.userList[this.accountIndex].address.substr(0,15)+"....";
				//this.showQrcode();
				this.$refs.receive.open('bottom');

			},
			successFunc() { //复制address
				uni.setClipboardData({
					data: this.userList[this.accountIndex].address,
					success: function() {
						uni.hideToast();
						uni.showToast({
							title: 'Content copied',
							duration: 2000
						});
						console.log('success');
					}
				});
				//this.$refs.receive.close();
				//this.$refs.success.open('bottom');
			},
			toDevice() { //打开device页
				if (this.has_device) {
					uni.navigateTo({
						url: "../device/index"
					});
				}
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index) {
				this.$refs.logout.open();
			} else {
				uni.navigateTo({
					url: "../setting/index"
				})
			}
		}
	};
</script>

<style lang="less">
	.qrcode-canvas {
		display: inline-block;
	}

	.page {
		padding: 37rpx 32rpx;
	}

	.success-text {
		font-size: 20rpx;
	}

	.waiting-text {
		.fxc;
		background-color: #0d1b37;

		.ic {
			.wh2(30);
			margin-right: 10rpx;
		}
	}

	.bottom-popup {
		.bbox;
		height: 704rpx;

		.top {
			height: 94rpx;
			.lb;
			position: relative;

			&::after {
				content: '';
				.wh(100, 10);
				border-radius: 5rpx;
				.center;
				background: #c3c3c3;
			}
		}

		.content {
			padding: 36rpx 70rpx 42rpx;
			text-align: center;

			.tit {
				font-size: 32rpx;
				margin-bottom: 34rpx;
			}

			.code {
				.wh2(288);
			}

			.tip {
				font-size: 26rpx;
				color: #999;
				padding: 26rpx 0 40rpx;
			}

			.vbtn_l {
				font-weight: bold;
			}
		}
	}

	.select-box {
		.fx;
		height: 62rpx;
		background: #fff;
		border-radius: 2em;
		padding: 0 6rpx;
		margin-bottom: 40rpx;
		width: 626rpx;
		.bbox;

		.logo {
			.wh2(48);
			margin-right: 16rpx;
		}

		picker {
			position: relative;
			margin-right: 46rpx;
			font-size: 26rpx;
			width: 150rpx;

			.iconfont {
				.c;
				.right;
				font-size: 20rpx;
			}
		}

		.str {
			font-size: 26rpx;
			color: #999;
			width: 240rpx;
			.row1;
		}
	}

	.datas-box {
		position: relative;
		margin-bottom: 46rpx;

		.bg {
			.wh(686, 174);
		}

		.content {
			position: absolute;
			left: 40rpx;
			top: 30rpx;
			bottom: 30rpx;
			right: 40rpx;
			color: #fff;
		}

		.hd {
			font-size: 26rpx;
			margin-bottom: 10rpx;

			.icon-eye {
				padding-left: 10rpx;
			}
		}

		.bd {
			.flex;
		}

		.val {
			font-size: 40rpx;
		}

		.unit {
			font-size: 26rpx;
			padding-left: 14rpx;
			padding-top: 14rpx;
		}
	}

	.nav-box {
		.fbet;
		text-align: center;
		margin: 0 40rpx 50rpx;

		.ic {
			.wh2(60);
			display: block;
			margin: 0 auto 10rpx;
		}

		.val {
			white-space: nowrap;
		}
	}

	.list-box {
		background: #fff;
		border-radius: 20rpx;
		padding: 0 38rpx;

		.hd {
			height: 116rpx;
			.lb;
			.fx;
			font-size: 32rpx;
			.c;
			font-weight: bold;

			.txt {
				position: relative;

				&::after {
					content: '';
					display: block;
					position: absolute;
					.wh(100, 4);
					.bgc;
					.centerx;
					bottom: -10rpx;
				}
			}
		}

		.bd {
			padding: 22rpx 0 22rpx;
		}

		.item {
			.fx;
			padding: 20rpx 0;

			.logo {
				.wh2(88);
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.info {
				.fg1;
			}
		}
	}
</style>