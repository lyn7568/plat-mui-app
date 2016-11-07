//我的账号
mui.plusReady(function(){
	
	/*定义全局变量*/
	var loginYes = document.getElementById("loginYes");
	var loginNo = document.getElementById("loginNo");
	var goLogin = document.getElementById("gologin");
	var goReg = document.getElementById("goreg");
	var removeId = document.getElementById("removeid");
	
	loginStatus();
	console.log('ddd');
	
	/*点击获取验证码*/
	removeId.addEventListener('tap',function(){
		plus.storage.removeItem('userid');
		goLoginFun();
	})
	goLogin.addEventListener('tap',function(){
		goLoginFun();
	})
	goReg.addEventListener('tap',function(){
		goRegFun();
	})
	
	/*判断登录是否成功*/
	function loginStatus(){
		var userId = plus.storage.getItem('userid');
		console.log(userId);
		if(userId && userId != "null" && userId!=null){
			loginYes.style.display="block";
		}else{
			loginNo.style.display="block";
		}
	}
	
	
})