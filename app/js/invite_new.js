mui.ready(function() {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting(); //新webview的载入完毕后关闭等待框
		ws.show("slide-in-right", 150);
		/*获得好友积分*/
		var person = {
			/*获得积分*/
			inviteIntegral: function() {
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
							document.getElementById("inviteFraction").innerHTML = $info.inviteScore + $info.myScore;
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			},
			/*邀请好友的位数*/
			inviteFriendsTotal: function() {
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
							document.getElementById("inviteFriends").innerHTML = $info;
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			},
			/*邀请的好友列表*/
			invitefriendsList: function() {
				mui.ajax(baseUrl + "/ajax/growth/qlInviter", {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					data: {
						"professorId": userId
					},
					timeout: 10000, //超时设置
					success: function(data) {
						console.log(JSON.stringify(data))
						if(data.success) {
							var $info = data.data,
								i = 0;
							for(i in $info) {
								person.professorBaseMess($info[i]);
							}
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			},
			/*查询专家基本信息*/
			professorBaseMess: function(proId) {
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
									"professorId": userId
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
			},
			/*好友邀请好友得总数*/
			frinedInviteFriends: function() {
				alert(11);
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
									console.log($info)
									document.getElementById("friendInviteFriend").innerHTML = $info;
								}
							},
							error: function() {
								plus.nativeUI.toast("服务器链接超时", toastStyle);
								return;
							}
						});
					},
		}
		person.inviteIntegral();
		person.inviteFriendsTotal();
		person.invitefriendsList();
		person.frinedInviteFriends();
	});
})