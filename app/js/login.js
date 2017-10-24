//登录
mui.ready(function() {

	/*定义全局变量*/
	var reg = document.getElementById("reg");
	var login = document.getElementById("login");
	var userName = document.getElementById("username");
	var userPassword = document.getElementById("password");
	var forgetPassword = document.getElementById("forgetPassword");
	var smsLogin = document.getElementById("smsLogin");

	mui.plusReady(function() {
		
        /*点击注册按钮*/
		reg.addEventListener("tap", function() {
			goRegFun();
		})
		
		/*点击短信登录*/
		smsLogin.addEventListener("tap", function() {
			mui.openWindow({
				url: '../html/loginTelNew.html',
				id: 'html/loginTelNew.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})
		
		/*点击忘记密码按钮*/
		forgetPassword.addEventListener("tap", function() {
			mui.openWindow({
				url: '../html/pwdFind.html',
				id: '../html/pwdFind.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})

		/*校验登录按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#username,#password", function() {
			hideButtn(userName,userPassword,login,"frmactiveok");
		});
		
		/*登录按钮*/
		login.addEventListener('tap', function() {
			userVal()
			console.log('点击登陆时id===='+plus.storage.getItem('userid'))
		})

		
		/*校验用户账号*/
		function userVal() {
			var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(userName.value)) {
				userRegisterOk();
			} else if(gunf.test(userName.value)) {
				userRegisterOk();
			} else {
				plus.nativeUI.toast("请输入正确的手机或邮箱", toastStyle)
				return;
			}
		}

		/*判断账号是否注册*/
		function userRegisterOk() {
			mui.ajax(baseUrl + '/ajax/isReg?key=' + userName.value, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.data)
					if(data.data == true) {
						plus.nativeUI.toast("用户不存在请注册用户", toastStyle);
						return;
					} else {
						passwordVal()
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		/*校验登录密码*/
		function passwordVal() {
			if(userPassword.value.length < 6) {
				plus.nativeUI.toast("密码由6-24个字符组成，区分大小写", toastStyle);
				return;
			} else {
				loginBut();
			}
		}

		/*提交登录*/
		function loginBut() {
			mui.ajax(baseUrl + '/ajax/login', {
				data: {
					"pw": userPassword.value,
					"lk": userName.value
				},
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.data)
					if(data.data != "null" && data.data != null) {
						var userId = data.data.id;
						plus.storage.setItem('userid', userId);
						plus.storage.setItem('name', data.data.name);
						plus.nativeUI.toast("登录成功", toastStyle);
						var article = plus.webview.currentWebview();
						if(article.ourl) {
							var proAiticle =plus.webview.getWebviewById(article.ourl)
							mui.fire(proAiticle, "newId");
						}
						firstLogin();
						
						var consultPage = plus.webview.getWebviewById('consultlistNew.html');
						mui.fire(consultPage, 'logined', {
							id: userId,
							rd:1
						});	
					} else {
						plus.nativeUI.toast("帐号和密码不匹配，请检查后重试", toastStyle);
						return;
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
					console.log(JSON.stringify(data))
					if(data.success) {
						if(data.data.authentication == undefined || data.data.authentication == null){
							var productView = mui.preload({
								url: '../html/fill-select.html',
								id: '../html/fill-select.html',
								show: {
									aniShow: "slide-in-right"
								},
								extras: {
									userid: professorId
								}
							});
							productView.show();
						}else{
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