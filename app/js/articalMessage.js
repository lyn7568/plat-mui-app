mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.articleId;	
	console.log(proId);
	function proInfoMain() {
		mui.ajax(baseUrl + "/ajax/leaveWord/ql", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"articleId": proId
			},
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(JSON.stringify(data))
				var $info = data.data || {};
				if(data.success && data.data) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	proInfoMain();
	document.getElementById("send").addEventListener("tap",function(){
		alert(1);
		return;
	})
});