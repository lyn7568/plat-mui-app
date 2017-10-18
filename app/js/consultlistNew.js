mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var content1 = document.getElementById('logined');
		var content2 = document.getElementById('unlogin');
		if(userid == null || userid == 'null') {
			content1.style.display = 'none';
		} else {
			content2.style.display = 'none';
			messageList()
		}
		/*登陆*/
		window.addEventListener('logined', function(event) {
			var userId = event.detail.id;
			content1.style.display = 'block';
			content2.style.display = 'none';
			messageList()
		});
		window.addEventListener('exited', function(event) {
			var userId = event.detail.id;
			content1.style.display = 'none';
			content2.style.display = 'block';
			document.getElementById('unlogin').style.display = 'block';
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
		var ws = new WebSocket("ws://192.168.3.233:8081/portal/websocket/msg?id=" + userid + "&pm=app");
		ws.onopen = function() {
			console.log(userid);
		};

		function messageList() {
			mui.ajax(baseUrl + '/ajax/webMsg/idx/qm', {
				data: {
					"id": userid
				}, 
				dataType: 'json', //服务器返回json格式数据
				type: 'GET', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true, //传数组必须加这个
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var $data = data.data;
						for(var i = 0; i < $data.length; i++) {
							var str = '<li class="mui-table-view-cell" data-id="'+$data[i].id+'">' +
								'<div class="madiaHead useHead" style="background-image:url(../images/default-photo.jpg)"><span class="mui-icon  icon-messagenew"><span class="mui-badge">56</span></span></div>' +
								'<div class="madiaInfo">' +
								'<div class="h1Font mui-ellipsis">' +
								'<span class="userName"></span>' +
								'<span class="authicon "></span>' +
								'<span class="thistime">' + commenTime($data[i].timeStr) + '</span>' +
								'</div>' +
								'<div class="h3Font mui-ellipsis">' + $data[i].cnt + '</div>' +
								'</div>' +
								'</li>'
								var $info=$(str)
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
		/*用户信息*/
		function userInformation(id, $itemlist) {
			mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + id, {
				"type": "get",
				"async": true,
				"success": function(data) {
					console.log(JSON.stringify(data))
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
		ws.onmessage = function(a) {
			var fol = true;
			var $info = JSON.parse(a.data);
			console.log(1111);
			var li=$("#consultList").find("li");
			$.each(li,function() {
				var $id=$(this).attr("data-id");
				if($info.sender==$id) {
					$(this).find(".icon-messagenew").show().end().find('.thistime').text(commenTime($info.sendTime)).end().find(".h3Font").text($info.cnt);
					if($(this).index()!=0) {
						$(this).remove().clone().prependTo($('#consultList'));
					}
				}
			})
			console.log(1212)
			return;
			var web = plus.webview.getWebviewById("1.html");
			mui.fire(web, "newId", {
				rd: $info.cnt
			});
		}
		ws.onclose = function() {

		}
		document.querySelector("#hh").addEventListener("tap", function() {
			alert(1234)
			mui.openWindow({
				url: '../html/weChat.html',
				id: 'weChat.html',
				show: {
					autoShow: true,
					aniShow: "slide-in-right",
				}
			});
		})
	})
})