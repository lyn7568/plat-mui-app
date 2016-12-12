//设置
mui.ready(function() {

	/*定义全局变量*/
	var removeId = document.getElementById("removeid");
	var security = document.getElementById("security");
	var userAgreement = document.getElementById("userAgreement");
	var about = document.getElementById("about");
	
	/*账户与安全*/
	security.addEventListener('tap',function(){
		plus.nativeUI.showWaiting();//显示原生等待框
        webviewShow = plus.webview.create("../html/security.html","../html/security.html");
	});
	
	/*关于科袖*/
	about.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/aboutus.html',
			id: '../html/aboutus.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	/*用户协议*/
	userAgreement.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/privacy.html',
			id: '../html/privacy.html',
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
				//plus.cache.clear();
				//plus.storage.clear();
				var userId = "null";
				mui.currentWebview.close();
				mui.back();
				var myaccountPage = plus.webview.getWebviewById('html/myaccount.html');
				mui.fire(myaccountPage, 'closeUser', {
					id: userId
				});
			}
		});
	})

});
