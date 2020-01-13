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
	    isSuccess = false,
      isUploadFile = false
	  }){
		this.beforeRequest({
			  url,
		    method,
		    header,
			  data,
		    success,
		    fail,
		    isMock,
		    isSuccess,
				isUploadFile
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
			// const options = {
			// 	url: `${apiPrefix}/applet/fixcommon/uploadFile`,
			// 	header: {
			// 		'content-type': 'application/json',
			// 		'token': token
			//   },
			// 	success (res){
			// 		resolve(JSON.parse(res.data));
			// 	},
			// 	fail(error){
			// 		reject(error);
			// 	}
			// }
			if(isUploadFile){
				const { filePath, name, formData} = data;
				delete options.data;
				wx.uploadFile(Object.assign({}, options, {
					filePath,
					name,
					formData,
				}));
			} else {
				wx.request(options);
			}
		});
	}
};
