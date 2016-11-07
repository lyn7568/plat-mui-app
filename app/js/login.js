//登录
mui.plusReady(function(){
	
	/*定义全局变量*/
	var reg = document.getElementById("reg");
	var login = document.getElementById("login");
	var userName = document.getElementById("username");
	var userPassword = document.getElementById("password");
	var phoneCode=false;
	
	reg.addEventListener("tap",function(){
		mui.openWindow({
			url:"reg.html",
			id:"reg.html",
			show:{
            	aniShow:"slide-in-right"
  			}
		})
	})
	
	/*校验登录按钮显示状态*/
	mui('.frmbox').on('keyup',"#username,#password",function() {
		hideButtn();
	});
	
	/*登录按钮*/
	login.addEventListener('tap',function(){
		if(phoneCode){
			loginBut();
		}else{
			userVal();
		}
	})
	
	/*校验按钮显示状态*/
	function hideButtn(){
		if(userName.value==""||userPassword.value==""){
			login.classList.remove('frmactiveok');
			login.disabled="disabled";
		}else{
			login.classList.add('frmactiveok');
			login.disabled="";
		}
	}
	
	/*校验用户账号*/
	function userVal(){
		console.log(userName.value);
		var gunf=/^\w+@\w+\.((cn)|(com)|(com\.cn))$/;
		var hunPhone=/^1[3|4|5|7|8]\d{9}$/;
		if(hunPhone.test(userName.value)){
			userRegisterOk();
		}else if(gunf.test(userName.value)){
			userRegisterOk();
		}else{
			plus.nativeUI.toast("请输入正确的手机或邮箱",toastStyle)
			return;
		}
	}
	
	/*判断账号是否注册*/
	function userRegisterOk(){
		mui.ajax(baseUrl+'/ajax/isReg?key='+userName.value,{
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.data)
				if(data.data == true) {
					plus.nativeUI.toast("用户不存在请注册用户",toastStyle);
					return;
				}else{
					passwordVal()
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时",toastStyle);
				return;
			}
		});
	}
	
	/*校验登录密码*/
	function passwordVal(){
		if(userPassword.value.length < 6){
			plus.nativeUI.toast("密码不少于6位",toastStyle);
			return;
		}else{
			phoneCode=true;
		}
	}	
	
    /*提交登录*/
	function loginBut(){
		mui.ajax(baseUrl+'/ajax/login',{
			data:{"pw":userPassword.value,"lk":userName.value},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.data)
				if(data.data != "null" && data.data != null){
					var userId=data.data.id;
				    plus.storage.setItem('userid',userId);
					firstLogin();
				}else{
					plus.nativeUI.toast("登录账号和密码不匹配!",toastStyle);
					return;
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时",toastStyle);
				return;
			}
		});
	}	
	
	
	/*判断用户第一次登录，是否填写了个人信息*/
	function firstLogin(){
		var professorId = plus.storage.getItem('userid');
		console.log(professorId);
		mui.ajax(baseUrl+"/ajax/professor/"+professorId,{
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.data)
				if(data.data!=null) {
					goHome();
				}else{
					var productView = mui.preload({
					    url:'../html/fillinfo.html',
						id:'../html/fillinfo.html',
						show:{
							aniShow:"slide-in-bottom"
						},
						extras:{
							userid:professorId
						}
					});
					productView.show(); 
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时",toastStyle);
				return;
			}
		});
	}
	
})