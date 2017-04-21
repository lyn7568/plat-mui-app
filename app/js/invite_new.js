var orderKey, professorName; //加载数据的传给后台的值
mui.init({
	pullRefresh: {
		container: '#pullrefresht',
		up: {
			height: 50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	setTimeout(function() {
		person.invitefriendsList(orderKey)
	}, 1000);
}
var person = {
	/*获得积分*/
	inviteIntegral: function() {
		mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/growth/queryScore", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: {
					"professorId": userId
				},
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						document.getElementById("inviteFraction").innerHTML = $info.inviteScore + $info.myScore + "分";
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		})
	},
	/*邀请好友的位数*/
	inviteFriendsTotal: function() {
		mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/growth/inviterCount", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: {
					"professorId": userId
				},
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						document.getElementById("inviteFriends").innerHTML = $info + "位";
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		})
	},
	/*邀请的好友列表*/
	invitefriendsList: function(pro) {
		mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			$ta = {
				professorId: userId,
				"rows": 20
			}
			if(pro) {
				$ta.createTime = orderKey;
			}
			mui.ajax(baseUrl + "/ajax/growth/qlInviter", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: $ta,
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $info = data.data,
							i = 0;
						if(!pro) {
							var ws = plus.webview.getWebviewById("invite_new.html");
							plus.nativeUI.closeWaiting(); //新webview的载入完毕后关闭等待框
							ws.show("slide-in-right", 150);
							professorName = ws.proName;
						}
						if($info.length == 0) {
							if(!pro) {
								document.getElementById("nodatalist").style.display = "block";
								document.getElementById("datalist").style.display = "none";
								mui('#pullrefresht').pullRefresh().disablePullupToRefresh(true);
								return;
							} else {
								mui('#pullrefresht').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
								return;
							}
						}

						orderKey = $info[$info.length - 1].createTime;
						if(data.data.length == 20) {
							mui('#pullrefresht').pullRefresh().endPullupToRefresh(false); /*能上拉*/
						} else {
							mui('#pullrefresht').pullRefresh().disablePullupToRefresh();
						}
						for(i in $info) {
							person.professorBaseMess($info[i].id);
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					mui('#pullrefresht').pullRefresh().endPullupToRefresh(true);
					return;
				}
			});
		})
	},
	/*查询专家基本信息*/
	professorBaseMess: function(proId) {
		mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/professor/baseInfo/" + proId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						mui.ajax(baseUrl + "/ajax/growth/inviterCount", {
							dataType: 'json', //数据格式类型
							type: 'GET', //http请求类型
							async: false,
							data: {
								"professorId": proId
							},
							timeout: 10000, //超时设置
							success: function(data) {
								if(data.success) {
									var $data = data.data;
									var oSty = autho($info.authType, $info.orgAuth, $info.authStatus)
									var img;
									var inviNum
									if($data == 0) {
										inviNum = "他还没有邀请好友！"
									} else {
										inviNum = "他邀请了 <span>" + $data + "</span> 位好友，为您带来了 <span>" + $data * 50 + "</span> 分积分奖励！"
									}
									($info.hasHeadImage == 1) ? img = baseUrl + "/images/head/" + $info.id + "_l.jpg": img = "../images/default-photo.jpg";
									var li = document.createElement("li");
									li.className = "mui-table-view-cell";
									var oString = '<div class="flexCenter">'
									oString += '<div class="userImg userRadius">';
									oString += '<img src="' + img + '"/>'
									oString += '</div>'
									oString += '<div class="userInfo">'
									oString += '<p class="h1Font positionR"><span>' + $info.name + '</span><em class="authicon ' + oSty.sty + '"></em></p>'
									oString += '<p class="h2Font">' + $info.orgName + '</p>'
									oString += '<p class="h3Font mui-ellipsis">' + inviNum + '</p>'
									oString += '</div>'
									oString += '</div>'
									li.innerHTML = oString;
									document.getElementById("friendsList").appendChild(li);
								}
							},
							error: function() {
								plus.nativeUI.toast("服务器链接超时", toastStyle);
								return;
							}
						});

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		})
	},
	/*好友邀请好友得总数*/
	frinedInviteFriends: function() {
		mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/growth/countByInviter", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: {
					"professorId": userId
				},
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						document.getElementById("friendInviteFriend").innerHTML = $info + "位";
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		})
	},
}
mui.ready(function() {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		person.inviteIntegral();
		person.inviteFriendsTotal();
		person.invitefriendsList();
		person.frinedInviteFriends();
		var inviteBtnLink = document.getElementById("inviteBtnLink");
		var inviteShow = document.getElementById("inviteShow");
		var promptClose = document.getElementsByClassName("promptClose");
		var promptBtn = document.getElementsByClassName("promptBtn");
		inviteBtnLink.addEventListener("tap", function() {
			inviteShow.setAttribute("style", "display:block");
			model.show(); //显示遮罩
		})
		promptBtn[0].addEventListener("tap", function() {
			model.close(); //关闭遮罩
		})
		promptClose[0].addEventListener("tap", function() {
			model.close(); //关闭遮罩
		})
		var invite = document.getElementById("invite");
		/*微信及微信朋友圈分享专家*/
		var auths, shares;
		invite.addEventListener("tap", function() {
			shareShow()
		});
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

		function shareShow() {
			var shareBts = [];
			// 更新分享列表
			var ss = shares['weixin'];
			if(navigator.userAgent.indexOf('StreamApp') < 0 && navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
				ss && ss.nativeClient && (shareBts.push({
						title: '微信好友',
						s: ss,
						x: 'WXSceneSession'
					}),
					shareBts.push({
						title: '微信朋友圈',
						s: ss,
						x: 'WXSceneTimeline'
					}));
			}
			//				// 弹出分享列表
			shareBts.length > 0 ? plus.nativeUI.actionSheet({
				title: '分享',
				cancel: '取消',
				buttons: shareBts
			}, function(e) {
				if(e.index == 1) {
					var share = buildShareService();
					if(share) {
						shareMessage(share, "WXSceneSession", {
							content: "科袖网，搭建企业与专家的桥梁。",
							title: professorName + "邀请您加入【科袖】",
							href: baseUrl + "/ekexiu/Invitation.html?professorId=" + userId + "&professorName=" + encodeURI(professorName),
							thumbs: [baseUrl + "/images/logo180.png"]
						});
					}
				} else if(e.index == 2) {
					var share = buildShareService();
					if(share) {
						shareMessage(share, "WXSceneTimeline", {
							content: professorName,
							title: "【科袖名片",
							href: baseUrl + "/ekexiu/Invitation.html?professorId=" + userId + "&professorName=" + encodeURI(professorName),
							thumbs: [baseUrl + "/images/logo180.png"]
						});
					}
				}

			}) : plus.nativeUI.alert('当前环境无法支持分享操作!');

		}

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
				var strtmp = "分享到\"" + share.description + "\"成功！ ";
				console.log(strtmp);
				plus.nativeUI.toast(strtmp, {
					verticalAlign: 'center'
				});
			}, function(e) {
				plus.nativeUI.closeWaiting();
				if(e.code == -2) {
					plus.nativeUI.toast('已取消分享', {
						verticalAlign: 'center'
					});
				}
			});
		}
	});
})