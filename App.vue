<script>
	//#ifdef APP-PLUS
	XMLHttpRequest = plus.net.XMLHttpRequest;
	// #endif
	export default {
		onLaunch: function() {
			this.$get_config();
			var is_first = uni.getStorageSync('first');
			if (is_first == "") {
				console.log("进入");
				uni.reLaunch({
					url: '/pages/dam/index',
					success() {
						// #ifdef APP-PLUS
						plus.navigator.closeSplashscreen();
						// #endif
					}
				});
				return;
			} else {
				var pwd = uni.getStorageSync('password');
				var user = uni.getStorageSync('user');
				var is_login = uni.getStorageSync('is_login');
				if (pwd == "" || !user) {
					uni.reLaunch({
						url: '/pages/dam/set',
						success() {
							// #ifdef APP-PLUS
							plus.navigator.closeSplashscreen();
							// #endif
						}
					});
				} else if (is_login != "1") {
					uni.reLaunch({
						url: '/pages/login/sign',
						success() {
							// #ifdef APP-PLUS
							plus.navigator.closeSplashscreen();
							// #endif
						}
					});
				} else {
					// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen();
					// #endif
				}
			}
			// window.addEventListener('touchend',function(e){
			// 	//处理操作间隔逻辑
			// 	console.log("touchend");
			// 	uni.setStorageSync('op_time', Date.now());
			// });
			//var autoSecond=uni.getStorageSync('autoSecond');
			//if(autoSecond!=""){
			//	this.globalData.autoLockOn();
			//}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {
			intervalID: null,
			autoLockOn: function() {
				// this.autoLockOff();
				// this.intervalID=setInterval(function(){
				// 	var is_login=uni.getStorageSync('is_login');
				// 	if(is_login==1){
				// 		var autoSecond=uni.getStorageSync('autoSecond');
				// 		var op_time=uni.getStorageSync('op_time')+autoSecond*1000;
				// 		if(Date.now()>op_time){
				// 			uni.setStorageSync('is_login', "0");
				// 			uni.reLaunch({url: '../login/sign'});
				// 		}
				// 	}
				// }, 1000);
			},
			autoLockOff: function() {
				if (this.intervalID != null)
					clearInterval(this.intervalID);
			}
		}
	};
</script>

<style lang="less">
	@import url('/static/css/iconfont.css');
	@import url('~@/static/css/dam.less');
	// @import "@/uni_modules/uview-ui/index.scss";

	uni-page-head .uni-page-head__title {
		text-transform: uppercase;
	}

	page {
		background: #f7f7f7;
	}

	.page {
		padding-bottom: 50upx;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	button.normal {
		line-height: 1;
		padding: 0;
		font-size: inherit;
		color: inherit;
		width: auto;
		background: none;
		margin-left: 0;
		margin-right: 0;

		&::after {
			border: 0;
		}
	}

	.bggray {
		.bggray;
	}

	.c {
		.c !important;
	}

	.cred {
		.cred !important;
	}

	.cgreen {
		.cgreen !important;
	}

	.cblue {
		.cblue;
	}

	.vbtn {
		border-radius: 2em;
		background: #0d1b37;
		color: #fff;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		border: 1px solid #0d1b37;
	}

	.vbtn_l {
		.vbtn;
		background: #fff;
		color: #0d1b37;
	}

	.popup {
		border-radius: 20rpx;
		background: #fff;
		width: 686rpx;
		.center;
		position: fixed;
		.bbox;
	}

	.popup-hd {
		height: 106rpx;
		line-height: 106rpx;
		text-align: center;
		font-size: 32rpx;
		position: relative;
		font-weight: bold;
		.lb;

		.iconfont {
			.right();
			font-size: 30rpx;
			color: #999;
		}
	}

	.msg-popup {
		padding: 40rpx;
		text-align: center;

		.tit {
			font-size: 32rpx;
			margin-bottom: 35rpx;
		}

		.btns {
			.fbet;
			height: 50rpx;
			line-height: 50rpx;

			.btn-item {
				.fg1;
				font-size: 28rpx;
			}

			.cancel {
				color: #3788f6;
			}

			.btn-item+.btn-item {
				border-left: 1px solid @line;
			}
		}
	}

	.toast-popup {
		width: 300rpx;
		text-align: center;
		height: 300rpx;
		padding: 20rpx 40rpx;
		.fyc;

		.ic {
			.wh2(66);
			display: block;
			margin: 0 auto 40rpx;
		}

		.txt {
			font-size: 32rpx;
			.c;
			line-height: 1.3;
			font-weight: bold;
		}
	}

	.success-text {
		.whhc(630, 66);
		min-width: 630rpx;
		border-radius: 33rpx;
		background: #0acf83;
		color: #fff;
		display: block;
		margin: 0 auto 60rpx;
		font-size: 26rpx;
	}

	.err {
		font-size: 22rpx;
		.cred;
		position: relative;
	}

	.eye {
		.wh2(50);
		.right;
		top: 60%
	}
</style>