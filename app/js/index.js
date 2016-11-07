//首页
mui.ready(function() {
	/*定义全局变量*/
	var isLogin = document.getElementById("isLogin");
	
	mui.plusReady(function() {
		
		/*点击个人中心按钮*/
		isLogin.addEventListener('tap', function() {
			mui.openWindow({
				url: 'html/myaccount.html',
				id: 'html/myaccount.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		});

	});
});
