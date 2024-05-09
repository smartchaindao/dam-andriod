import {
	request
} from "./index.js"
// 获取app配置
export const app_config = (data) => {
	return request({
		url: "/blockchain/config",
		method: "get",
		data
	})
}
// 检查设备是否可用
export const check_device = (data) => {
	return request({
		url: "/dam/check_device",
		data
	})
}
// 存储交易日志，只上传成功
export const save_transfer_log = (data) => {
	return request({
		url: "/clientDam/transactionDam/transferLog",
		method: "put",
		data
	})
}

// 设备信息
export const deviceInfo = (data) => {
	return request({
		url: "/clientDam/node/deviceInfo",
		method: "get",
		data
	})
}

// 奖励列表
export const reward_list = (data) => {
	return request({
		url: "/clientDam/node/rewardList",
		data
	})
}

// 交易信息
export const trans = (data) => {
	return request({
		url: "/clientDam/transactionDam/sumTrans",
		method: "get",
		data
	})
}
// hpc=>wusdt 汇率
export const getRate = (data) => {
	return request({
		url: "/clientDam/flash/getRate",
		method: "get",
		data
	})
}


// 提交hpc=>wusdt
export const savaConvertRescord = (data) => {
	return request({
		url: "/clientDam/flash/savaConvertRescord",
		method: "put",
		data
	})
}


// 更新hpc=>wusdt
export const updateConvertRescord = (data) => {
	return request({
		url: "/clientDam/flash/updateConvertRescord",
		method: "post",
		data
	})
}
// 手续费用
export const getFeesInfo = (data) => {
	return request({
		url: "/clientDam/flash/getFeesInfo",
		method: "get",
		data
	})
}


// 保存transfer
export const savaTransferRescord = (data) => {
	return request({
		url: "/clientDam/flash/savaTransferRescord",
		method: "put",
		data
	})
}
// 更新transfer
export const updateTransferRescord = (data) => {
	return request({
		url: "/clientDam/flash/updateTransferRescord",
		method: "post",
		data
	})
}