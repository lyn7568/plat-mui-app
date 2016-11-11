//首页
mui.ready(function() {
	/*定义全局变量*/
	var inputEmail = document.getElementById("inputemail");
	var sendCode = document.getElementById("sendcode");

	/*发送按钮*/
	sendCode.addEventListener("tap", function() {
		userEmail();
	});

	mui.plusReady(function() {

		/*校验用户账号*/
		function userEmail() {
			var gunf = /^\w+@\w+\.((cn)|(com)|(com\.cn))$/;
			if(gunf.test(inputEmail.value)) {
				sendEmail();
			} else {
				plus.nativeUI.toast("请输入正确的邮箱", toastStyle);
				return;
			}
		}

		/*判断账号是否注册*/
		function sendEmail() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + '/ajax/reqBindMail', {
				data: {
					"userid": userId,
					"mail": inputEmail.value
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success && data.data) {
						plus.nativeUI.toast("发送成功，请登录邮箱验证", toastStyle);
						return;
						mui.currentWebview.close();
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