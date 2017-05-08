//注册信息设置密码
mui.ready(function() {

    /*定义全局变量*/
	var passWord = document.getElementById("password");
	var passwordOK = document.getElementById("password2");
	var registerOk = document.getElementById("registerok");

	mui.plusReady(function() {
		
        var self = plus.webview.currentWebview();
        
		/*校验提交按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#password,#password2", function() {
			hideButtn(passWord,passwordOK,registerOk,"frmactiveok");
		});

		/*提交设置密码*/
		registerOk.addEventListener('tap', function() {
			valOld()
		});

		function valOld() {
			if(passWord.value.length < 6 && passwordOK.value.length < 6) {
				plus.nativeUI.toast("密码由6-24个字符组成，区分大小写", toastStyle);
				return;
			} else if(passwordOK.value != passWord.value) {
				plus.nativeUI.toast("两次输入不一致，请重新输入", toastStyle);
				return;
			} else {
				/*if(self.num==1){
					completepaw();
				}else{
					completeReg();	
				}*/
				completepaw();
			}
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