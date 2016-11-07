//首页
mui.plusReady(function(){
	
	/*定义全局变量*/
	var isLogin = document.getElementById("isLogin");
	var userId = plus.storage.getItem('userid');
	console.log(userId);
	/*点击个人中心按钮*/
	isLogin.addEventListener('tap', function(){
		myAccount();
	});
	
	
});