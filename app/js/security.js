//注册信息
var bdPhone = document.getElementById("bdPhone");
var bdEmail = document.getElementById("bdEmail");
var changePass = document.getElementById("changepass");
var phoneName = document.getElementById("phonename");
var emailName = document.getElementById("emailname");
var verified = document.getElementById("verified");
var phoneCookie = "";
var emailCookie = "";
var authStatus;

/*退出绑定手机页面*/
window.addEventListener('xsphone', function(event) {
	phoneCookie = event.detail.phonetel;
	phoneName.innerText = phoneCookie;
})

mui.plusReady(function() {
	
	window.addEventListener('sPage', function(event) {
		istyle();
	})

	istyle();

	lookup();

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

	function ifPhoneAmdEmail() {
		/*判断是否绑定了手机号*/
		if(phoneCookie) {
			/*phoneName.innerText = (phoneCookie.substring(0, 3) + "****" + phoneCookie.substring(7, 11));*/
			phoneName.innerText = phoneCookie;
		} else {
			phoneName.innerText = "请绑定手机号";
		}

		/*判断是否绑定了邮箱*/
		if(emailCookie != "" && emailCookie != null && emailCookie != "null") {
			emailName.innerText = emailCookie;
		} else {
			emailName.innerText = "请绑定邮箱";
		}
	}

	/*实名认证*/
	function istyle() {
		var userId = plus.storage.getItem('userid');
		var isrenzheng = document.getElementById("isrenzheng");
		mui.ajax(baseUrl + "/ajax/professor/auth", {
			data: {
				"id": userId
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			async: false,
			success: function(data) {
				console.log(JSON.stringify(data));
				var $info = data.data || {};
				if(data.success && data.data) {
					authStatus = $info.authStatus;
					console.log(authStatus)
					if(authStatus == -1) {
						isrenzheng.innerHTML = "认证失败";
					} else if(authStatus == 0) {
						isrenzheng.innerHTML = "未认证";
					} else if(authStatus == 1) {
						isrenzheng.innerHTML = "待认证";
					} else if(authStatus == 2) {
						isrenzheng.innerHTML = "认证中";
					} else if(authStatus == 3) {
						isrenzheng.innerHTML = "已认证";
					}
					verified.addEventListener('tap', function() {
						if(authStatus == -1 || authStatus == 0) {
							mui.openWindow({
								url: '../html/realname-authentication.html',
								id: 'realname-authentication.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-right"
								}
							});
						}
					})
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}

	function lookup() {
		var userId = plus.storage.getItem('userid');
		mui.ajax(baseUrl + "/ajax/qaUser", {
			data: {
				id: userId
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			async: true,
			success: function(data) {
				plus.webview.currentWebview().show("slide-in-right", 150);
				plus.nativeUI.closeWaiting();
				var $info = data.data || {}
				if(data.success && $info) {
					emailCookie = $info.email;
					phoneCookie = $info.mobilePhone;
					ifPhoneAmdEmail();
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}

})