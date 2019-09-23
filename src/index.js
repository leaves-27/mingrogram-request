export default class Request {
	constructor(){
		this.count = 0;
	}
	beforeRequest(request, next){
		next(request);
	}
	afterRequest(response, next){
		next(response);
	}
	request({
	    url = '',
	    method = 'get',
	    header = {},
		data = {},
	    success = ()=>{},
	    fail = ()=>{},
	    isMock = false,
	    isSuccess = false
	  }){
		this.beforeRequest({
			url,
		    method,
		    header,
			data,
		    success,
		    fail,
		    isMock,
		    isSuccess
		}, (params)=>{
			const options = {
				...params,
				success: (res) => {
					this.afterRequest({
						response: res,
						request: params
					},(response)=>{
						const { data } = res;
						success(data);
					});
				},
				fail: (error) => {
					this.afterRequest(error,(error)=>{
						fail(error.errMsg);
					});
				}
			};
			wx.request(options);
		});
	}
};