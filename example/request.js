import Request from '../src/Request';
const request = new Request();
/**
 * 请求拦截器
 * */
request.beforeRequest = function({
	url = '',
	method,
	data,
	header,
	isMock,
	isSuccess,
}, next){
	const token = wx.getStorageSync('token');
	const params = {
		url,
		method,
		data,
		header: {
			'content-type': 'application/json',
			'token': token,
			...header
		},
	};

	if (isMock){
		if (isSuccess){
			success({});
		} else {
			fail({});
		}
		return;
	}
	next(params);
};

request.afterRequest  = function (result, next){
	const { request, response, errMsg = '' } = result;

	if(!!errMsg){ // 请求失败
		// 若请求超时，则给用户提示让其稍后再试
		if (errMsg === 'request:fail timeout'){
			wx.showToast({
				icon:'none',
				title: '响应超时，请重新操作'
			});
			return;
		}
	} else { // 请求成功
		const { data } = response;
		const { code, statusCode } = data;
		// 若token过期，则跳转到授权登录页重新授权登录
		const tokenInitCount = 0; // 自动登录尝试请求的次数
		const MAX_COUNT = 6; // 自动登录最大尝试请求次数
		if(code === 'session_out'){
			const count = wx.getStorageSync('tokenCount') || 1;
			if(count * 1 === MAX_COUNT){
				wx.setStorageSync('tokenCount', tokenInitCount);
				return;
			}
			wx.setStorageSync('token', '');
			wx.setStorageSync('tokenCount', count + 1);
			wx.navigateTo({
				url: '/pages/login/login'
			});
			return;
		}
	}

	next();
};

export default request;