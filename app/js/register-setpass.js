//注册信息设置密码
mui.ready(function() {

    /*定义全局变量*/
	var passWord = document.getElementById("password");
	var passwordOK = document.getElementById("password2");
	var registerOk = document.getElementById("registerok");

	mui.plusReady(function() {
		
        var self = plus.webview.currentWebview();
        
		/*校验提交按钮显示状态*/
		mui('.frmbox').on('keyup', "#password,#password2", function() {
			hideButtn(passWord,passwordOK,registerOk,"frmactiveok");
		});

		/*提交设置密码*/
		registerOk.addEventListener('tap', function() {
			valOld()
		});

		function valOld() {
			if(passWord.value.length < 6 && passwordOK.value.length < 6) {
				plus.nativeUI.toast("密码不少于6位，请输入正确的密码", toastStyle);
				return;
			} else if(passwordOK.value != passWord.value) {
				plus.nativeUI.toast("两次密码不一致", toastStyle);
				return;
			} else {
				if(self.num==1){
					completepaw();
				}else{
					completeReg();	
				}
				
			}
		}

		//注册提交
		function completeReg() {
			mui.ajax(baseUrl + '/ajax/regmobile', {
				data: {
					state: self.state,
					mobilePhone: self.phoneName,
					validateCode: self.setCode,
					password: passwordOK.value
				},
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				async: false,
				success: function(data) {
					if(data.success) {
						var userId = data.data;
						plus.storage.setItem('userid', userId);
						plus.nativeUI.toast("已完成注册，请填写个人信息", toastStyle);
						mui.openWindow({
							url: 'fillinfo.html',
							id: 'fillinfo.html',
							extras: {
								userid: userId
							},
							show: {
								aniShow: "slide-in-right"
							}
						});
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		
		//找回密码提交
		function completepaw() {
			mui.ajax(baseUrl + '/ajax/resetPasswordWithMobilePhone', {
				data: {
					state: self.state,
					mobilePhone: self.phoneName,
					vc: self.setCode,
					pw: passwordOK.value
				},
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				async: false,
				success: function(data) {
					if(data.success&&data.data) {
						goLoginFun();
						plus.webview.close(self);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}

	});

});