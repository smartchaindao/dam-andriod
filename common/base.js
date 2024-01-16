window.addEventListener('touchend',function(e){
	//处理操作间隔逻辑
	console.log("touchend");
	uni.setStorageSync('op_time', Date.now());
});