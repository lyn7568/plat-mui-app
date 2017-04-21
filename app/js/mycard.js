//我的名片
mui.ready(function() {
	var professorName, professortitle, professorid;
	var rlist = '';
	mui.plusReady(function() {
		var slfe = plus.webview.currentWebview();
		var num = slfe.num;
		var todayScore = slfe.todayScore;
		var lastDayScore = slfe.lastDayScore;
		if(num == 1) {
			var signedshow = document.getElementById("signedshow");
			document.getElementById("getIntegral").innerText = todayScore;
			document.getElementById("TomorrowIntegral").innerText = lastDayScore;
			signedshow.style.display = "block";
			plus.nativeUI.closeWaiting();
			slfe.show("fade-in", 500);
			mui('body').on('tap', "#promptBtn,#bodybg", function() {
				mui.back();
			});
		} else {
			userInformation();
			var mycardshow = document.getElementById("mycardshow");
			mycardshow.style.display = "block";
			mui('body').on('tap', "#promptClose,#bodybg", function() {
				mui.back();
			});
			//微信分享
			var qrcode = new QRCode(document.getElementById("qrcode"), {
				width: 120,
				height: 120
			});

			makeCode();

			function makeCode() {
				var professorId = plus.storage.getItem('userid');
				var elurl = baseUrl + "/ekexiu/shareProinfor.html?professorId=" + professorId;
				qrcode.makeCode(elurl);
			}

			/*微信及微信朋友圈分享专家*/
			var auths, shares;
			plus.oauth.getServices(function(services) {
				auths = {};
				for(var i in services) {
					var t = services[i];
					auths[t.id] = t;

				}
			}, function(e) {
				alert("获取登录服务列表失败：" + e.message + " - " + e.code);
			});
			plus.share.getServices(function(services) {
				shares = {};
				for(var i in services) {
					var t = services[i];
					shares[t.id] = t;
				}
			}, function(e) {
				alert("获取分享服务列表失败：" + e.message + " - " + e.code);
			})

			document.getElementById("weixin").addEventListener('tap', function() {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: "研究方向：" + rlist,
						title: "【科袖名片】" + professorName + " " + professortitle + "",
						href: baseUrl + "/ekexiu/shareProinfor.html?professorId=" + professorid,
						thumbs: [baseUrl + "/images/head/" + professorid + "_m.jpg"]
					});
				}
			})

			document.getElementById("weixinp").addEventListener('tap', function() {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: "研究方向：" + rlist,
						title: "【科袖名片】" + professorName + " " + professortitle + "",
						href: baseUrl + "/ekexiu/shareProinfor.html?professorId=" + professorid,
						thumbs: [baseUrl + "/images/head/" + professorid + "_m.jpg"]
					});
				}
			})

			function buildShareService() {
				var share = shares["weixin"];
				if(share) {
					if(share.authenticated) {
						console.log("---已授权---");
					} else {
						console.log("---未授权---");
						share.authorize(function() {
							console.log('授权成功...')
						}, function(e) {
							alert("认证授权失败：" + e.code + " - " + e.message);
							return null;
						});
					}
					return share;
				} else {
					alert("没有获取微信分享服务");
					return null;
				}
			}

			function shareMessage(share, ex, msg) {
				msg.extra = {
					scene: ex
				};
				share.send(msg, function() {
					plus.nativeUI.closeWaiting();
					//var strtmp = "分享到\"" + share.description + "\"成功！ ";
					shareAddIntegral();
					/*plus.nativeUI.toast(strtmp, {
						verticalAlign: 'center'
					});*/
				}, function(e) {
					plus.nativeUI.closeWaiting();
					if(e.code == -2) {
						plus.nativeUI.toast('已取消分享', {
							verticalAlign: 'center'
						});
					}
				});
			}

		}

		//用户信息
		function userInformation() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/professor/info/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				//async: false,
				success: function(data) {
					if(data.success && data.data) {
						var $info = data.data || {};
						professorName = $info.name;
						professortitle = $info.title;
						professorid = $info.id;
						document.getElementById("userName2").innerText = $info.name;
						document.getElementById("orgName2").innerText = $info.orgName;
						if($info.hasHeadImage == 1) {
							var mun = Math.round(Math.random() * 99 + 1);
							userImg2.setAttribute("src", baseUrl + "/images/head/" + $info.id + "_l.jpg?" + mun);
						} else {
							userImg2.setAttribute("src", baseUrl + "/images/default-photo.jpg");
						}

						if($info.title) {
							document.getElementById("office").innerText = $info.office + " , " + $info.title;
						} else {
							document.getElementById("office").innerText = $info.office;
						}
						var researchAreas = $info.researchAreas;
						for(var n = 0; n < researchAreas.length; n++) {
							rlist += researchAreas[n].caption
							if(n < researchAreas.length - 1) {
								rlist += " , "
							}
						}

						plus.nativeUI.closeWaiting();
						slfe.show("fade-in", 500);

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