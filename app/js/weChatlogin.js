mui.plusReady(function() {
	plus.oauth.getServices(function(services) {
		auths = {};
		for(var i in services) {
			var t = services[i];
			auths[t.id] = t;

		}
	}, function(e) {
		alert("获取登录服务列表失败：" + e.message + " - " + e.code);
	});
	document.getElementById("weixin").addEventListener("tap", function() {
		var s = auths["weixin"];
		if(s) {
			if(!s.authResult) {
				s.login(function(e) {
					mui.toast("登录认证成功！");
					authUserInfo(s);
				}, function(e) {
					mui.toast("登录认证失败！");
				});
			} else {
				mui.toast("已经登录认证！");
				authLogout();
			}
		} else {
			mui.toast("不支微信登录");
		}
	});

	function authLogout() {
		for(var i in auths) {
			var s = auths[i];
			if(s.authResult) {
				s.logout(function(e) {
					console.log("注销登录认证成功！");
				}, function(e) {
					console.log("注销登录认证失败！");
				});
			}
		}
	}

	function authUserInfo(s) {
		console.log(s);
		s.getUserInfo(function(e) {
			var josnStr = JSON.stringify(s.userInfo);
			var jsonObj = s.userInfo;
			console.log("获取用户信息成功：" + josnStr);
			console.log(jsonObj.openid)
			authLogout();
			console.log(jsonObj.openid)
			weChat(jsonObj.openid,jsonObj.nickname);
		}, function(e) {
			alert("获取用户信息失败：" + e.message + " - " + e.code);
		});
	}

	function weChat(weiChatId,weixinName) {
		mui.ajax(baseUrl + "/ajax/oauth/openidLogin", {
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000, //超时设置
			data: {
				oauthType: 'weixin',
				openid: weiChatId
			},
			success: function(data) {
				if(data.success) {
					if(data.data == null) {
						mui.openWindow({
							url: '../html/backBindUn.html',
							id: 'backBindUn.html',
							show: {
								autoShow: true,
								aniShow: "slide-in-right"
							},
							 extras:{
							 	name:weixinName,
							 	openid:weiChatId
							 }
						});
					}
				}
			},
			error: function(x) {
				console.log(JSON.stringify(x))
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
})