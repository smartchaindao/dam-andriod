import config from "@/common/config.js"
export const request = (options) => {
	let {
		method,
		data,
		url
	} = options
	url = config.baseUrl + url
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: method || "post",
			data,
			success: (res) => {
				const {
					data
				} = res
				if (data.code === 0) {
					resolve([null, res.data])
				} else {
					resolve([data.msg])
				}

			},
			fail: (err) => {
				resolve([err])
			}
		})
	})
}