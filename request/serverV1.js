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