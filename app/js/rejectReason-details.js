//谢绝理由
var content = document.getElementById("content");
mui.plusReady(function(){
 	var self = plus.webview.currentWebview();
 	var consultId = self.consultId;
	submtbut();
 	/*谢绝理由*/
 	function submtbut(){
	 	mui.ajax(baseUrl + '/ajax/consultReject/reasons', {
			data: {
				"consultId": consultId,
			}, //咨询ID
			dataType: 'json', //服务器返回json格式数据
			type: 'GET', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success && data.data){
					console.log(data.data.length)
					var cent=""; 
					for(var i=0;i<data.data.length;i++){
						cent += ' ' + data.data[i].sort + '、' + data.data[i].rejectReason;
					}
					content.innerHTML="感谢您的咨询，但很抱歉，由于以下原因，暂时不能接受您的咨询：" + cent + "。";
				}
			},
			error: function() { 
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
 	}
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().show("slide-in-right",150);
})