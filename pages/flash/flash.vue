<template>
	<view class="page">
		<view class="form">
			<view class="item">
				<view class="tip">From:</view>
				<input type="text" v-model="userinfo" disabled="true" />
			</view>
			<view class="item">
				<view class="tip">
					Amount:
					<view class="ricon" @tap="tomax">Max</view>
				</view>
				<input type="number" v-model="amount" />
			</view>
			<view class="transform-item">
				<view class="tip">
					Convert:
				</view>
				<view class="tip ml-2">
					<view class="">
						{{exchange}} WUSDT
					</view>
					<view class="">
						{{`1 HPC = ${transformInfo.rate} WUSDT`}}
					</view>
					<view class="">
						Slippery Rate: {{slipperyRate}}%
					</view>
				</view>
			</view>
			<view class="transform-item item">
				<view class="tip">
					Slippery Rate:
				</view>
				<view class="tip" style="width: 100%;">
					<u-slider v-model="slipperyRate" :min="0" :max="10" :step=".5"></u-slider>
					<view class="minMax">
						<text>0%</text>
						<text>10%</text>
					</view>
				</view>
			</view>
			<view v-if="showTip" class="err">{{tip_text}}</view>
			<view class="dam-vbtn" @tap="nextConver">Next</view>
		</view>
		<u-modal :show="convertInfo.show" ref="uModal" title="Flush Convert" :showConfirmButton="false">
			<view class="">
				<view class="convert-content" v-html="convertInfo.content">
				</view>
				<view class="btn-gp" v-if="!time">
					<u-button :plain="true" :hairline="true" text="Cancel" @tap="convertInfo.show=false"></u-button>
					<u-button type="primary" text="Convert" @tap="next"></u-button>
				</view>	
				<view class="btn-gp" v-else>
					<u-button :plain="true" :hairline="true" text="Accept" @tap="Transfer"></u-button>
					<u-button type="primary" :text="`Reject ${clock}S`" @tap="convertInfo.show=false"></u-button>
				</view>
			</view>
		</u-modal>
		<uni-popup ref="popup">
			<view class="success-text">Sent Successfully</view>
		</uni-popup>
		<u-notify ref="notify"></u-notify>
	</view>
</template>

<script>
	import {
		getRate,
		savaConvertRescord,
		updateConvertRescord
	} from "@/request/serverV1.js"
	const Web3 = require('web3')
	let web3;
	let contractObj;
	export default {
		data() {
			return {
				user: [],
				showTip: false,
				showModal: false,
				tip_text: "",
				balance: 0,
				toAddress: "",
				amount: "",
				process: false,
				transformInfo: {
					hpcBalance: 0,
					rate: 0,
					usdtBalance: 0,
					wusdtBalance: 0,
					lowestAmount: 100
				},
				slipperyRate: 0.5,
				errInfo: {
					show: false,
					content: ""
				},
				convertInfo: {
					show: false,
					content: "",
					clock: 10
				},
				lock: false,
				time: null,
				clock: 10,
				transferId: "",
			};
		},
		computed: {
			userinfo() {
				return `Account  balance: ${String( this.balance).substr(0,16)} HPC`
			},
			exchange() {
				return this.amount * this.transformInfo.rate
			}
		},
		onBackPress() {
			if (this.process)
				return true;
		},
		async onLoad() {
			const user = uni.getStorageSync("user")
			const [err, res] = await getRate()
			if (!err) {
				this.transformInfo = res.data
			}
			this.user = user
			web3 = new Web3(new Web3.providers.HttpProvider(this.eth_url));
			this.getBalance()
			this.gasPrice = await web3.eth.getGasPrice()
		},
		methods: {
			async getRateClock() {
				const [err, res] = await getRate()
				if (!err) {
					this.transformInfo = res.data
				}
				if (this.lock) return
				setTimeout(() => {
					this.getRateClock()
				}, 10000)
				return res.code
			},
			// 获取余额
			async getBalance() {
				const userCur = this.user[0]
				const blance = await web3.eth.getBalance(userCur.address)
				this.balance = web3.utils.fromWei(blance, "ether")
			},
			tomax() { //max
				if (this.balance < this.transformInfo.lowestAmount) {
					this.$refs.notify.show({
						top: 10,
						type: 'error',
						duration: 1000 * 3,
						message: `Your balance is below the minimum redeemable amount  ${this.transformInfo.lowestAmount}`,
						fontSize: 16,
						safeAreaInsetTop: true
					})
					this.amount = "0"
				} else {
					this.amount = this.balance
				}
			},
			async nextConver() {
				if (this.user.length <= 0) {
					this.tip_text = "Wrong From";
					this.showTip = true;
					return;
				}

				if (this.amount == "" || this.amount <= 0 || Number(this.amount) > Number(this.balance)) {
					this.tip_text = "Wrong Amount";
					this.showTip = true;
					return;
				}
				if (this.balance - this.amount < 0) {
					this.tip_text =
						`The balance is below the minimum redeemable amount ${this.transformInfo.lowestAmount}`
					this.showTip = true;
					return;
				}
				this.showTip = false;
				this.convertInfo.content =
					`Your ${this.amount} HPC can be exchanged to ${this.transformInfo.rate*this.amount} WUSDT.`
				this.convertInfo.show = true
			},

			async next() { //next
				const [err, res] = await savaConvertRescord({
					"rateInfo": this.transformInfo,
					convertAmount: this.amount * this.transformInfo.rate,
					fromAddress: this.user[0].address,
					toAddress: this.contract_address.Vault,
					txAmount: Number(this.amount),
					slipperyRate: (this.slipperyRate / 100)
				})
				if (err) {
					this.$refs.notify.show({
						top: 10,
						type: 'error',
						duration: 1000 * 3,
						message: err,
						fontSize: 16,
						safeAreaInsetTop: true
					})
					this.transformInfo=res.data
					this.time = setInterval(() => {
						this.clock--
						if (this.clock === 0) {
							this.convertInfo.show = false
							this.clock = 10
							clearInterval(this.time)
							this.time = null
						}
					}, 1000)
					this.convertInfo.content = `
					The exchange rate has been changed.</br>
					Now, it is 1HPC to ${this.convertInfo.rate} WUSDT.</br>
					Your ${this.amount} HPC can be exchanged to ${this.amount*this.transformInfo.rate} WUSDT.`
					return
				}
				this.transferId = res.data
				this.Transfer()
			},
			async Transfer() {
				this.convertInfo.show = false
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
				let log = {
					cdate: Date.now(),
					from: account.address,
					to: this.contract_address.Vault,
					nonce: nonce,
					amount: this.amount,
					status: 'Submitted'
				};

				const gasLimit = await web3.eth.estimateGas({
					from: account.address,
				})

				console.log(gasLimit, "gasLimit")

				let transactionObject = {
					//from:account.address,
					to: this.contract_address.Vault,
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
					console.log(result_send, "result_send------------")
					const [err, res] = await updateConvertRescord({
						id: this.transferId,
						txHash: result_send.transactionHash,
						txState: true,
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

	.transform-item {
		display: flex;

		.ml-2 {
			margin-left: 15px;
		}
	}

	.minMax {
		display: flex;
		justify-content: space-between;
	}

	.convert-content {
		width: 100%;
		line-height: 48rpx;
	}

	.btn-gp {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
	}
</style>