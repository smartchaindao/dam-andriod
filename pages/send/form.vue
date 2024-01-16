<template>
	<view class="page">
		<view class="form">
			<view class="item">
				<view class="tip">From:</view>
				<input type="text" v-model="userinfo" disabled="true" />
			</view>
			<view class="item">
				<view class="tip ">
					To:
					<view class="iconfont icon-xiangji ricon" @tap="scan"></view>
				</view>
				<input type="text" placeholder="" v-model="toAddress" />
			</view>
			<view class="item">
				<view class="tip">
					Amount:
					<view class="ricon" @tap="tomax">Max</view>
				</view>
				<input type="number" v-model="amount" />
			</view>
			<view v-if="showTip" class="err">{{tip_text}}</view>
			<view @click="sureFunc" class="dam-vbtn" @tap="next">Next</view>
		</view>

		<uni-popup ref="popup">
			<view class="success-text">Sent Successfully</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		save_transfer_log
	} from "@/request/serverV1.js"
	const Web3 = require('web3')
	let web3;
	export default {
		data() {
			return {
				user: [],
				showTip: false,
				tip_text: "",
				balance: 0,
				toAddress: "",
				amount: "",
				process: false
			};
		},
		computed: {
			userinfo() {
				return `Account  balance: ${String( this.balance).substr(0,16)} HPC`
			}
		},
		onBackPress() {
			if (this.process)
				return true;
		},
		async onLoad() {
			const user = uni.getStorageSync("user")
			this.user = user
			web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			console.log(web3)
			this.getBalance()
			this.gasPrice = await web3.eth.getGasPrice()
		},
		methods: {
			// 获取余额
			async getBalance() {
				const userCur = this.user[0]
				const blance = await web3.eth.getBalance(userCur.address)
				this.balance = web3.utils.fromWei(blance, "ether")
			},
			tomax() { //max
				if (this.balance > 2000)
					this.amount = this.balance - 2000;
				else
					this.amount = "0";
			},
			scan() { //扫码填入to
				var that = this;
				uni.scanCode({
					success: function(res) {
						that.toAddress = res.result;
					}
				});
			},
			async next() { //next
				if (this.user.length <= 0) {
					this.tip_text = "Wrong From";
					this.showTip = true;
					return;
				}
				if (this.toAddress == "") {
					this.tip_text = "Wrong To";
					this.showTip = true;
					return;
				}
				if (this.toAddress.length != 42) {
					if (this.toAddress.length == 40 && this.toAddress.indexOf("0x") != 0) {
						this.toAddress = "0x" + this.toAddress;
					} else {
						this.tip_text = "Wrong Address";
						this.showTip = true;
						return;
					}
				}
				if (this.amount == "" || this.amount <= 0 || Number(this.amount) >= Number(this.balance)) {
					this.tip_text = "Wrong Amount";
					this.showTip = true;
					return;
				}
				if (this.balance - this.amount < 2000) {
					this.tip_text = "The balance must be >=2000";
					this.showTip = true;
					return;
				}
				this.showTip = false;


				var logs = uni.getStorageSync('logs');
				if (!logs) logs = [];
				let abi_data;
				uni.showLoading({
					title: 'Processing...',
					mask: true
				});
				this.process = true;
				let account = web3.eth.accounts.privateKeyToAccount(this.user[0].privateKey);
				// 获取nonce
				let nonce;
				try {
					nonce = await web3.eth.getTransactionCount(account.address)
				} catch (err) {
					uni.hideLoading();
					this.process = false;
					uni.showModal({
						title: 'Error',
						content: err.message,
						showCancel: false
					});
					console.log("nonce error")
					return
				}

				console.log("nonce:" + nonce);
				let log = {
					cdate: Date.now(),
					from: account.address,
					to: this.toAddress,
					nonce: nonce,
					amount: this.amount,
					status: 'Submitted'
				};
				
				const gasLimit=await web3.eth.estimateGas({
					from:account.address,
				})
				
				console.log(gasLimit,"gasLimit")
				
				let transactionObject = {
					//from:account.address,
					to: this.toAddress, //that.toAddress,
					//value:web3.utils.toWei('0',"ether"),//web3.utils.toWei(that.amount,"ether"),
					gas: this.gasPrice,
					gasLimit: web3.utils.toHex(gasLimit),
					nonce: nonce,
					value: web3.utils.toWei(this.amount, "ether")
				};
				console.log(transactionObject)
				let sign, result_send;
				// 签名
				try {
					sign = await account.signTransaction(transactionObject)
				} catch (error) {
					//TODO handle the exception
					uni.hideLoading();
					this.process = false;
					uni.showModal({
						title: 'Error',
						content: error.message,
						showCancel: false
					});
					console.log("sign error")
					return
				}
				// 发起交易
				try {
					result_send = await web3.eth.sendSignedTransaction(sign.rawTransaction)
				} catch (error) {
					//TODO handle the exception
					uni.hideLoading();
					uni.showModal({
						title: 'Error',
						content: error.message,
						showCancel: false
					});
					console.log("send error")
					log.status = 'Failed';
					log.msg = error.message;
					logs.push(log);
					uni.setStorageSync('logs', logs);
					this.process = false;
					return
				}

				if (result_send.status) {
					const [err, res] = await save_transfer_log({
						hash: result_send.transactionHash,
						fromAddress: account.address,
						toAddress: this.toAddress,
						ifiAmount: this.amount,
						timestamp: log.cdate.toString().substring(0, 10)
					})
					this.$refs.popup.open('bottom');
					this.toAddress = "";
					this.amount = "";
					log.status = 'Confirmed';
					//查询余额
					this.getBalance()
				} else {
					uni.showModal({
						title: 'Error',
						content: 'Sent Failed',
						showCancel: false
					});
					log.status = 'Failed';
					log.msg = 'Sent Failed';
				}
				log.transactionHash = result_send.transactionHash;
				logs.push(log);
				uni.setStorageSync('logs', logs); //保存交易至本地日志
				this.process = false;
				uni.hideLoading()


			}
		}
	};
</script>

<style lang="less">
	.form {
		.vbox;
		margin: 30rpx 30rpx 0;
		padding: 0 40rpx 40rpx;

		.tip {
			font-size: 30rpx;
			padding: 26rpx 0 10rpx;
			position: relative;

			.ricon {
				.xs;
				.right;
			}

			.iconfont {
				font-size: 40rpx;
			}
		}

		input {
			.lb;
			height: 70rpx;
			margin-bottom: 20rpx;
			font-size: 24rpx;
		}

		.err {
			margin-bottom: 36rpx;
		}
	}

	.err {
		margin-top: -10rpx;
	}
</style>