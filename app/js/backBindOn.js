mui.plusReady(function() {
	var accountNumber=document.getElementById("accountNumber");
	var oPassword=document.getElementById("password");
	var oBuilding=document.getElementById("building");
	var ws = plus.webview.currentWebview();
	console.log(ws.openid)
	mui('.frmboxNew').on('keyup', "#accountNumber,#password", function() {
			if(accountNumber.value == "" || oPassword.value == "" ) {
				oBuilding.setAttribute("disabled","disabled");
			} else {
				if(oBuilding.getAttribute("disabled")==null) {
					return;
				}
				oBuilding.removeAttribute("disabled");
			}
		});
	/*绑定按钮*/
		oBuilding.addEventListener('tap', function() {
			userVal();
		})
		/*校验用户账号*/
		function userVal() {
			var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(accountNumber.value)) {
				userRegisterOk();
			} else if(gunf.test(accountNumber.value)) {
				userRegisterOk();
			} else {
				plus.nativeUI.toast("请输入正确的手机或邮箱", toastStyle)
				return;
			}
		}
		/*判断账号是否注册*/
		function userRegisterOk() {
			mui.ajax(baseUrl + '/ajax/isReg?key=' + accountNumber.value, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.data)
					if(data.data == true) {
						plus.nativeUI.toast("该账号不存在，请检查后重试", toastStyle);
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
			if(oPassword.value.length < 6) {
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
					"pw": oPassword.value, 
					"lk": accountNumber.value
				},
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.data)
					if(data.data != "null" && data.data != null) {
						var userId = data.data.id;
						buildingWeiChat(userId);
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
		function buildingWeiChat(id){
			console.log(ws.openid);
			console.log(id);
			mui.ajax(baseUrl + '/ajax/oauth/associate', {
				data: {
					oauthType:"weixin", 
					openid   :ws.openid,
					userid   :id
				},
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						plus.storage.setItem('userid', id);
						var proAiticle =plus.webview.getWebviewById('professorArticle.html')
							mui.fire(proAiticle, "newId");
						var consultPage = plus.webview.getWebviewById('consultlist.html');
						mui.fire(consultPage, 'logined', {
							id: id
						});	
						firstLogin();
					}else{
						if(data.code==-2) {
							plus.nativeUI.toast("该账号已绑定微信号", toastStyle);
							return;
						}
					}
				},
				error: function(x) {
					console.log(JSON.stringify(x));
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
})