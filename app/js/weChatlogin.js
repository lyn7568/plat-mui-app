mui.plusReady(function() {
	var auths;
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
		console.log(weiChatId);
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
					console.log(JSON.stringify(data));
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
					}else{
						plus.storage.setItem('userid', data.data.id);
						console.log(data.data.id)
						firstLogin();
						var proAiticle =plus.webview.getWebviewById('professorArticle.html')
							mui.fire(proAiticle, "newId");
							var consultPage = plus.webview.getWebviewById('consultlist.html');
						mui.fire(consultPage, 'logined', {
							id: data.id
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
					console.log(data.data.authentication)
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
							 var curr = plus.webview.currentWebview();
						var wvs = plus.webview.all();
						for(var i = 0, len = wvs.length; i < len; i++) {
							//关闭除setting页面外的其他页面
							if(wvs[i].getURL() == curr.getURL())
								continue;
							plus.webview.close(wvs[i]);
						}
						//打开login页面后再关闭setting页面
						plus.webview.open('../index.html');
						curr.close();
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