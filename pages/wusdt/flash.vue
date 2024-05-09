<template>
	<view class="page">
		<view class="form">
			<view class="item">
				<view class="tip">From:</view>
				<input type="text" v-model="userinfo" disabled="true" />
			</view>
			<view class="item">
				<view class="tip">Chain:</view>
				<input type="text" value="Ethereum" disabled="true" />
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
				<view class="">
					min Fees: 20 WUSDT or 2% of amount
				</view>
			</view>
			<view class="item" style="display: flex; align-items: center;margin-top: 60rpx;">
				<view>
					Fees:
				</view>
				<view class="">
					{{txFees}} WUSDT
				</view>
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
		getFeesInfo,
		savaTransferRescord,
		updateTransferRescord
	} from "@/request/serverV1.js"
	let web3;
	let contract;
	let contractVault;
	let wallet;
	export default {
		data() {
			return {
				user: [],
				showTip: false,
				tip_text: "",
				balance: 0,
				toAddress: "",
				amount: "",
				process: false,
				transformInfo: {

				},
			};
		},
		computed: {
			userinfo() {
				return `Account  balance: ${String( this.balance).substr(0,16)} WUSDT`
			},
			txFees() {
				const {
					lowestAmount,
					doorSillAmount,
					percentage,
				} = this.transformInfo
				const {
					amount
				} = this
				if (!lowestAmount) return 0
				if (amount >= doorSillAmount) {
					const fees = amount * percentage
					if (fees < lowestAmount) {
						return lowestAmount
					} else {
						return fees
					}
				} else {
					return lowestAmount
				}

			},

		},
		onBackPress() {
			if (this.process)
				return true;
		},
		async onLoad() {
			const user = uni.getStorageSync("user")
			this.user = user
			const userCur = this.user[0]
			await this.web3Ex.init()
			const {
				provider,
				ethers
			} = this.web3Ex
			this.toAddress = userCur.address
			let wallet = new ethers.Wallet(userCur.privateKey, provider);
			this.getBalance()
			this.getFeesInfo()
		},
		methods: {
			// 获取余额
			async getBalance() {
				const userCur = this.user[0]
				const {
					wusdtContract,
					web3
				} = this.web3Ex
				if (!wusdtContract) {
					setTimeout(() => {
						this.getBalance()
					}, 1000)
					return
				}
				wusdtContract.methods.balanceOf(userCur.address).call().then(result => {
					this.balance = web3.utils.fromWei(result, "ether")
				})
			},
			async getFeesInfo() {
				const [err, res] = await getFeesInfo()
				if (err) return
				this.transformInfo = res.data
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

				if (this.amount == "" || this.amount <= 0 || Number(this.amount) >= Number(this.balance)) {
					this.tip_text = "Wrong Amount";
					this.showTip = true;
					return;
				}
				if (this.balance - this.amount < 0) {
					this.tip_text = "The balance must be >=2000";
					this.showTip = true;
					return;
				}
				if (this.amount <= this.txFees) {
					this.tip_text = `The amout must be >${this.txFees}`;
					this.showTip = true;
					return
				}
				this.showTip = false;

				uni.showLoading({
					title: 'Processing...',
					mask: true
				});
				this.process = true;
				const {
					ethers,
					config,
					provider,
					wusdtAbi,
					vaultAbi,
					web3
				} = this.web3Ex
				const userCur = this.user[0]
				const [err, res] = await savaTransferRescord({
					"fromAddress": userCur.address,
					"toAddress": this.toAddress,
					"txAmount": this.amount,
					"fees": this.txFees
				})
				if (err) {
					uni.hideLoading();
					this.tip_text = err;
					this.showTip = true;
					return
				}
				// 初始化钱包
				let wallet = new ethers.Wallet(userCur.privateKey, provider);
				// 链接合约WUSDT
				let cWUSDT = new ethers.Contract(config.contracts.WUSDT, wusdtAbi, wallet);
				// approve函数
				const tx = await cWUSDT.approve(config.contracts.Vault, web3.utils.toWei(this.amount, "ether"))
				await tx.wait()
				// const allow = await cWUSDT.allowance(userCur.address, config.contracts.Vault)
				// 链接合约Vault
				let cVault = new ethers.Contract(config.contracts.Vault, vaultAbi, wallet);
				// 添加流动性,转账
				const ad = await cVault.addLiquidity(web3.utils.toWei(this.amount, "ether"), config.contracts.WUSDT, 0)
				await ad.wait()
				const [er, re] = await updateTransferRescord({
					id: res.data,
					txHash: ad.hash,
					txState: true
				})
				if (err) {
					uni.hideLoading();
					this.tip_text = err;
					this.showTip = true;
					return
				}
				uni.hideLoading();
				this.getBalance()
				this.$refs.popup.open('bottom');
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