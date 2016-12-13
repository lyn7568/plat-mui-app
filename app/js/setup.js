//设置
mui.ready(function() {

	/*定义全局变量*/
	var removeId = document.getElementById("removeid");
	var security = document.getElementById("security");
	var userAgreement = document.getElementById("userAgreement");
	var about = document.getElementById("about");
	var feedBack = document.getElementById("feedBack");
	var claims = document.getElementById("claims");
	var FAQ = document.getElementById("FAQ");
	var contactService = document.getElementById("contactService");
	
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
	});
	
	/*意见反馈*/
	feedBack.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/feedback.html',
			id: '../html/feedback.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
	/*投诉举报*/
	claims.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/claims.html',
			id: '../html/claims.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
	/*常见问题*/
	FAQ.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/faq.html',
			id: '../html/faq.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
	/*联系客服*/
	contactService.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/contactservice.html',
			id: '../html/contactservice.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
});
