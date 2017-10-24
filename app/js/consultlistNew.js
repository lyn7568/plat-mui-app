mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var content1 = document.getElementById('logined');
		var content2 = document.getElementById('unlogin');
		//console.log(document.getElementById("meLI").innerHTML)
		if(userid == null || userid == 'null') {
			content1.style.display = 'none';
		} else {
			content2.style.display = 'none';
			messageList(true)
		}
		/*登陆*/
		window.addEventListener('logined', function(event) {
			userid = event.detail.id;
			content1.style.display = 'block';
			content2.style.display = 'none';
			messageList(true);
			var web4 = plus.webview.getLaunchWebview();
			mui.fire(web4, "newId", {
				rd: 3
			});
			if(event.detail.rd) {
				websocket1();
			}

		});
		window.addEventListener('exited', function(event) {
			var userid = event.detail.id;
			content1.style.display = 'none';
			content2.style.display = 'block';
			document.getElementById('unlogin').style.display = 'block';
			var web4 = plus.webview.getLaunchWebview();
			mui.fire(web4, "newId", {
				rd: 2
			});
		});
		var regBtn = document.getElementById("regBtn");
		var logBtn = document.getElementById("logBtn");

		//	注册
		regBtn.addEventListener('tap', function() {
			mui.openWindow({
				url: '../html/reg.html',
				id: '../html/reg.html',
				show: {
					aniShow: "slide-in-right"
				}
			});

		});
		//登陆
		logBtn.addEventListener('tap', function() {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				}
			});

		});
		websocket1()

		function websocket1() {
			var ws = new WebSocket("ws://192.168.3.233:8081/portal/websocket/msg?id=" + userid + "&pm=app");
			ws.onopen = function() {

			};
			ws.onmessage = function(a) {
				var fol = true;
				var $info = JSON.parse(a.data);

				var li = $("#consultList").find("li");
				var cf = 1;
				$.each(li, function() {
					var $id = $(this).attr("data-id");

					if($info.sender == $id) {
						$(this).attr("data-time", $info.sendTime)
						cf = 0;
						

						var web = plus.webview.getWebviewById("weChat.html");

						if(web) {
							if(web.professorId == $info.sender) {
								$(this).find('.thistime').text(commenTime($info.sendTime)).end().find(".h3Font").text($info.cnt);
								readed.call($(this), $id, $info.sendTime);
								mui.fire(web, "newId", {
									rd: $info.cnt,
									sendTime: $info.sendTime
								});
							} else {
								$(this).find(".icon-messagenew").show().end().find('.mui-badge').text(Number($(this).find(".mui-badge").text()) + 1).end().find('.thistime').text(commenTime($info.sendTime)).end().find(".h3Font").text($info.cnt);
								var web3 = plus.webview.getLaunchWebview();
								mui.fire(web3, "newId", {
									rd: 1
								});
								toNum();
							}
						} else {
							toNum();
							$(this).find(".icon-messagenew").show().end().find('.mui-badge').text(Number($(this).find(".mui-badge").text()) + 1).end().find('.thistime').text(commenTime($info.sendTime)).end().find(".h3Font").text($info.cnt);
							var web3 = plus.webview.getLaunchWebview();
							mui.fire(web3, "newId", {
								rd: 1
							});

						}
						if($(this).index() != 0) {
							$(this).remove().clone().prependTo($('#consultList'));
						}
					}
				})

				if(cf) {

					var str1 = '<li class="mui-table-view-cell" data-id="' + $info.sender + '" data-time="' + $info.sendTime + '">' +
						'<div class="mui-slider-handle"><div class="madiaHead useHead" style="background-image:url(../images/default-photo.jpg)"><span class="mui-icon  icon-messagenew"><span class="mui-badge">1</span></span></div>' +
						'<div class="madiaInfo">' +
						'<div class="h1Font mui-ellipsis">' +
						'<span class="userName"></span>' +
						'<span class="authicon "></span>' +
						'<span class="thistime">' + commenTime($info.sendTime) + '</span>' +
						'</div>' +
						'<div class="h3Font mui-ellipsis">' + $info.cnt + '</div>' +
						'</div></div><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div>' +
						'</li>'
					var $info1 = $(str1)
					$("#consultList").prepend($info1);
					var web1 = plus.webview.getWebviewById("weChat.html");
					if(web1) {
						if(web1.professorId == $info.sender) {
							mui.fire(web1, "newId", {
								rd: $info.cnt,
								sendTime: $info.sendTime
							});
							readed.call($info1, $info.sender, $info.sendTime);
						}
					}
					userInformation($info.sender, $info1)
					var web3 = plus.webview.getLaunchWebview();
							mui.fire(web3, "newId", {
								rd: 1
							});
				}
			}
			ws.onclose = function() {

			}
		}
		window.addEventListener("newId", function(event) {
			messageList(false);
		})

		function messageList(bole) {
			mui.ajax(baseUrl + '/ajax/webMsg/idx/qm', {
				data: {
					"id": userid
				},
				async: bole,
				dataType: 'json', //服务器返回json格式数据
				type: 'GET', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true, //传数组必须加这个
				success: function(data) {

					if(data.success) {
						$("#consultList").html("");
						var $data = data.data;
						for(var i = 0; i < $data.length; i++) {
							if($data[i].num == 0) {
								var ostyle = "none";
							} else {
								var ostyle = "block";
							}
							var str = '<li class="mui-table-view-cell" data-id="' + $data[i].id + '" data-time="' + $data[i].timeStr + '">' +
								'<div class="mui-slider-handle"><div class="madiaHead useHead" style="background-image:url(../images/default-photo.jpg)"><span class="mui-icon  icon-messagenew" style="display:' + ostyle + '"><span class="mui-badge">' + $data[i].num + '</span></span></div>' +
								'<div class="madiaInfo">' +
								'<div class="h1Font mui-ellipsis">' +
								'<span class="userName"></span>' +
								'<span class="authicon "></span>' +
								'<span class="thistime">' + commenTime($data[i].timeStr) + '</span>' +
								'</div>' +
								'<div class="h3Font mui-ellipsis">' + $data[i].cnt + '</div>' +
								'</div></div><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div>' +
								'</li>'
							var $info = $(str)
							$("#consultList").append($info);
							userInformation($data[i].id, $info)
						}
					}
				},
				error: function(x) {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		var btnArray = ['确认', '取消'];
		mui('#consultList').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认删除该会话？', btnArray, function(e) {
				if(e.index == 0) {
					mui.ajax(baseUrl + '/ajax/webMsg/disable/show', {
						"type": "post",
						"async": true,
						"data": {
							owner: userid,
							actor: li.getAttribute("data-id")
						},
						"context": this,
						"success": function(data) {
							if(data.success) {
								li.parentNode.removeChild(li);
								var web3 = plus.webview.getLaunchWebview();
							mui.fire(web3, "newId", {
								rd: 3
							});
							}
						},
						"error": function() {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
					});

				} else {
					setTimeout(function() {
						mui.swipeoutClose(li);
					}, 0);
				}
			});
		});
		/*用户信息*/
		function userInformation(id, $itemlist) {
			mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + id, {
				"type": "get",
				"async": true,
				"success": function(data) {

					if(data.success && data.data) {
						$itemlist.find(".userName").text(data.data.name);
						if(data.data.hasHeadImage == 1) {
							$itemlist.find(".useHead").attr("style", "background-image: url(" + baseUrl + "/images/head/" + data.data.id + "_m.jpg)");
						}
						var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
						$itemlist.find(".authicon").addClass(userType.sty);
					}
				},
				"error": function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}

		mui("#consultList").on("tap", "li", function() {
			var opId = this.getAttribute("data-id");
			var oTimeStr = this.getAttribute("data-time");
			console.log($(this).find(".icon-messagenew").css("display"))
			if($(this).find(".icon-messagenew").css("display") == "block" || $(this).find(".icon-messagenew").css("display") == "inline-block") {
				readed.call($(this), opId, oTimeStr);
			} else {
				mui.openWindow({
					url: '../html/weChat.html',
					id: 'weChat.html',
					show: {
						autoShow: true,
						aniShow: "slide-in-right",
					},
					extras: {
						professorId: opId
					}
				})
			}

		})
		//消息制为已读
		function readed(pId, timeStr) {
			mui.ajax(baseUrl + '/ajax/webMsg/readed', {
				"type": "post",
				"async": true,
				"data": {
					sender: pId,
					reciver: userid,
					time: timeStr
				},
				"context": this,
				"success": function(data) {
					if(data.success) {
						this.find(".icon-messagenew").hide().end().find(".mui-badge").text(0);
						mui.openWindow({
							url: '../html/weChat.html',
							id: 'weChat.html',
							show: {
								autoShow: true,
								aniShow: "slide-in-right",
							},
							extras: {
								professorId: pId
							}
						})
					}
				},
				"error": function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
	})
})