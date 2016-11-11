//设置
mui.ready(function() {

	/*定义全局变量*/
	var removeId = document.getElementById("removeid");
	var security = document.getElementById("security");
	
	security.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/security.html',
			id: '../html/security.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
	});

	/*退出按钮*/
	removeId.addEventListener('tap', function() {
		var btn = ["退出", "取消"];
		mui.confirm("是否退出", "提示", btn, function(e) {
			if(e.index == 0) {
				plus.storage.removeItem("userid");
				var userId = "null";
				mui.currentWebview.close();
				var myaccountPage = plus.webview.getWebviewById('html/myaccount.html');
				mui.fire(myaccountPage, 'closeUser', {
					id: userId
				});
			}
		});
	})

});
