mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		//查询学术领域
		var subjectShow = function(data) {
			if(data != undefined && data.length != 0) {
				var subs = new Array();
				if(data.indexOf(',')) {
					subs = data.split(',');
				} else {
					subs[0] = data;
				}
				if(subs.length > 0) {
					var html = [];
					for(var i = 0; i < subs.length; i++) {
						html.push("<li>" + subs[i] + "<span class='closeThis'>删除</span></li>");
					};
					document.getElementsByClassName("labelshow")[0].innerHTML = html.join('');
				}
			}
		}
		if(ws.subject) {
			subjectShow(ws.subject);
		}

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		mui(".labelshow").on("tap", "span", function() {
			var val = this.parentNode;
			document.getElementsByClassName('labelshow')[0].removeChild(val);
		});
		document.getElementsByClassName("addlabelbtn")[0].addEventListener("tap", function() {
			var addContent = document.getElementsByTagName('input')[0].value;
			var content = trim(addContent);
			var oleng = document.getElementsByTagName("li");

			if(content) {
				if(oleng.length >= 20) {
					plus.nativeUI.toast("最多添加20个行业领域", toastStyle);
					return;
				}
				for(var i = 0; i < document.getElementsByTagName("li").length; i++) {
					if(content == document.getElementsByTagName("li")[i].innerText.replace(/删除/, "")) {
						plus.nativeUI.toast("添加内容不能重复", toastStyle);
						return;
					}
				}
				if(content.length > 15) {
					plus.nativeUI.toast("学术领域不得超过15个字", toastStyle);
					return;
				}
				var node = document.createElement("li");
				node.innerHTML = content + '<span class="closeThis">删除</span>';
				document.getElementsByClassName("labelshow")[0].appendChild(node);
				document.getElementsByTagName('input')[0].value = "";
				
			} else {
				plus.nativeUI.toast("请填写您的学术领域", toastStyle);
			}
		});
		document.getElementById('login').addEventListener("tap", function() {
			var subjects = document.getElementsByTagName("li");
			var subjectAll = "";
			if(subjects.length > 0) {
				for(var i = 0; i < subjects.length; i++) {
					subjectAll += subjects[i].innerText.replace(/删除/, "");
					subjectAll += ',';
				};
				subjectAll = subjectAll.substring(0, subjectAll.length - 1);
			}
			console.log(subjectAll);
			mui.ajax(baseUrl + '/ajax/professor/subject', {
				data: {
					"id": userid,
					"subject": subjectAll
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("userInforUpdate.html");
						mui.fire(web, "newId", {
							subject: subjectAll
						});
						mui.back();
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		});
	});
})