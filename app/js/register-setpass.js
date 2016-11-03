//注册信息设置密码
mui.init();
mui.plusReady(function(){
	
	/*定义全局变量*/
	var passWord = document.getElementById("password");
	var passwordOK = document.getElementById("password2");
	var registerOk = document.getElementById("registerok");
	var oldPass = false;
	var isPass = false;
	var self=plus.webview.currentWebview();
	
	/*校验第一个密码*/
	passWord.addEventListener('blur', function() {
		valOld();
	});
	
	/*校验确认密码*/
	passwordOK.addEventListener('blur', function() {
		valNew();
	});
	
	//完成注册
	registerOk.addEventListener('tap', function() {
		completeReg();
	});
    
	function valOld(){
		if(passWord.value.length==0){
			plus.nativeUI.toast("密码不能为空",toastStyle);
			oldPass = false;
		}else if(passWord.value.length < 6){
			plus.nativeUI.toast("密码不少于6位，请输入正确的密码",toastStyle);
		}else{
			oldPass = true;
		}
	}
	
	function valNew(){
		if(passwordOK.value.length==0){
			plus.nativeUI.toast("密码不能为空",toastStyle);
			isPass = false;
		}else if(passwordOK.value.length<6){
			plus.nativeUI.toast("密码长度过短,至少六位",toastStyle);
			isPass = false;
		}else if(passwordOK.value != passWord.value){
			plus.nativeUI.toast("两次密码不一致",toastStyle);
			isPass = false;
		}else{
			isPass = true;
		}
	}
	
	function completeReg(){
		if(oldPass&&isPass){
			mui.ajax(baseUrl+'/ajax/regmobile',{
				data:{state:self.state,mobilePhone:self.phoneName,validateCode:self.setCode,password:passwordOK.value},
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				async: false,
				timeout: 10000, //超时设置
				success: function(data) {
						console.log(data)
					if(data.success) {
						state=data.data;
						console.log(state)
						plus.nativeUI.toast("注册成功",toastStyle);
					}
				},
				error: function() {
						plus.nativeUI.toast("服务器链接超时",toastStyle);
				}
			});	
		}else{
			valOld();
			valNew();
		}
	}
	
})