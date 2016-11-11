//注册信息
mui.ready(function() {

	/*定义全局变量*/
	var bdPhone = document.getElementById("bdPhone");
	var bdEmail = document.getElementById("bdEmail");
	var changePass = document.getElementById("changepass");
	var phoneName = document.getElementById("phonename");
	var emailName = document.getElementById("emailname");
	var verified = document.getElementById("verified");

	var phoneCookie = "15010738349"
	var emailCookie = "374353146@qq.com";

	mui.plusReady(function() {
		
		isAuthentication();

		/*判断是否绑定了手机号*/
		if(phoneCookie != "" && phoneCookie != null && phoneCookie != "null") {
			console.log(phoneCookie);
			phoneName.innerText = (phoneCookie.substring(0, 3) + "****" + phoneCookie.substring(7, 11));
		} else {
			phoneName.innerText = ("ddd");
		}

		/*判断是否绑定了邮箱*/
		if(emailCookie != "" && emailCookie != null && emailCookie != "null") {
			emailName.innerText = (emailCookie);
		} else {
			phoneName.innerText = ("");
		}

		bdEmail.addEventListener('tap', function() {
			mui.openWindow({
				url: '../html/bindmail.html',
				id: '../html/bindmail.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})

		bdPhone.addEventListener('tap', function() {
			mui.openWindow({
				url: '../html/bindphone.html',
				id: '../html/bindphone.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})

		changePass.addEventListener('tap', function() {
			mui.openWindow({
				url: '../html/changepass.html',
				id: '../html/changepass.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		})

		function isAuthentication() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var $info = data.data || {}
					if(data.success && data.data) {
						if($info.authentication){
							verified.innerText="已认证";
						}else{
							verified.innerText="为认证";
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

});