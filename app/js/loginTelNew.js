//登录
mui.ready(function() {

	/*定义全局变量*/
	var reg = document.getElementById("reg");
	var login = document.getElementById("login");
	var userName = document.getElementById("username");
	var setCode = document.getElementById("setCode");
	var forgetPassword = document.getElementById("forgetPassword");
    var accountLogin = document.getElementById("accountLogin");
    var obtainCode = document.getElementById("obtain-code");
    var state;
	mui.plusReady(function() {
		
        /*点击注册按钮*/
		reg.addEventListener("tap", function() {
			goRegFun();
		})
		
		/*点击账号登录*/
		accountLogin.addEventListener("tap", function() {
			mui.back();
		})
		
		/*点击忘记密码按钮*/
		forgetPassword.addEventListener("tap", function() {
			mui.openWindow({
				url: '../html/findpwd-phone.html',
				id: '../html/findpwd-phone.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})

		/*校验登录按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#username,#setCode", function() {
			hideButtn(userName,setCode,login,"frmactiveok");
		});
		
		/*登录按钮*/
		login.addEventListener('tap', function() {
			loginBut();
		})
		
		/*点击获取验证码*/
		obtainCode.addEventListener('tap', function() {
			phoneVal();
		})
		
		userName.addEventListener('keyup', function() {
			if(userName.value==""){
				obtainCode.disabled = "disabled";
			}else{
				obtainCode.disabled = "";
			}
		})
		
		/*校验手机号*/
		function phoneVal() {
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(userName.value)) {
				sendAuthentication();
			} else {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
		}

		/*手机发送验证码*/
		function sendAuthentication() {
			mui.ajax(baseUrl + '/ajax/sendMobileForLogin', {
				data: {
					mobilePhone: userName.value
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				async: false,
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						if(data.data!=null){
							state = data.data;
							doClick();
						}else{
							plus.nativeUI.toast("该账号不存在，请检查后重试", toastStyle);
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
		
		/*60s后重新获取验证码*/
		function doClick() {
			var getCodeOff = document.getElementById("getcodeoff");
			obtainCode.style.display = "none";
			getCodeOff.style.display = "block";
			getCodeOff.value = "60s后重新获取";
			var clickTime = new Date().getTime();
			var Timer = setInterval(function() {
				var nowTime = new Date().getTime();
				var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
				if(second > 0) {
					getCodeOff.value = second + "s后重新获取";
				} else {
					clearInterval(Timer);
					obtainCode.style.display = "block";
					getCodeOff.style.display = "none";
					obtainCode.value = "获取验证码";
				}
			}, 1000);
		}
		
		/*提交登录*/
		function loginBut() {
			mui.ajax(baseUrl + '/ajax/mobileLogin', {
				data: {
					"state": state,
					"mobilePhone": userName.value,
					"validateCode": setCode.value
				},
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success){
						var userId = data.data.id;
						plus.storage.setItem('userid', userId);
						var article = plus.webview.currentWebview();
						if(article.flag==1){
							var proAiticle =plus.webview.getWebviewById('professorArticle.html')
							mui.fire(proAiticle, "newId");
						}
						var consultPage = plus.webview.getWebviewById('consultlist.html');
						mui.fire(consultPage, 'logined', {id: userId});	
						
						firstLogin();
						
					}else{
						if(data.code==-1){
							plus.nativeUI.toast("验证码已过期，请重新获取", toastStyle);
						}else if(data.code==-2){
							plus.nativeUI.toast("手机号与验证码不匹配", toastStyle);
						}else if(data.code==-3){
							plus.nativeUI.toast("验证码错误，请检查后重试", toastStyle);
						}else if(data.code==-4){
							plus.nativeUI.toast("该账号不存在，请检查后重试", toastStyle);
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		/*判断用户第一次登录，是否填写了个人信息*/
		function firstLogin() {
			var professorId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/professor/" + professorId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				async: false,
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						if(data.data.authentication == undefined || data.data.authentication == null){
							var productView = mui.preload({
								url: '../html/fillinfo.html',
								id: '../html/fillinfo.html',
								show: {
									aniShow: "slide-in-right"
								},
								extras: {
									userid: professorId
								}
							});
							productView.show();
						}else{
					        var clogin = plus.webview.getWebviewById('../html/login.html');
					        plus.webview.close(clogin);
					        mui.back();
					        var myaccountPage = plus.webview.getWebviewById('html/myaccount.html');
							mui.fire(myaccountPage, 'closeUser', {
								id: professorId
							});
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}


	});

});