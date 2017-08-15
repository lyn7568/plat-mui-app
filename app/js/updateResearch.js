mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		console.log(ws.researchAreas)
		//查询学术领域
		var subjectShow = function(data) {
			var html = [];
			for(var i = 0; i < data.length; i++) {
				console.log(data[i].caption);
				html.push("<li><span class='numThis mui-pull-left'>"+ data[i].count+"</span><span class='otsave mui-pull-left'>" + data[i].caption + "</span><span class='closeThis'>删除</span></li><div></div>");
			};
			document.getElementsByClassName("labelshowT")[0].innerHTML = html.join('');
		}
		if(ws.researchAreas) {
			subjectShow(ws.researchAreas);
		} 

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		mui(".labelshow").on("tap", "span", function() {
			var val = this.parentNode;
			document.getElementsByClassName('labelshow')[0].removeChild(val);
			var lilength = document.getElementsByTagName("li").length;
			
		});
		document.getElementsByClassName("addlabelbtn")[0].addEventListener("tap", function() {
			var addContent = document.getElementsByTagName('input')[0].value;
			var content = trim(addContent);
			var oleng = document.getElementsByTagName("li");

			if(content) {
				if(oleng.length >= 10) {
					plus.nativeUI.toast("最多添加10个研究方向", toastStyle);
					return;
				}
				for(var i = 0; i < document.getElementsByTagName("li").length; i++) {
					if(content == document.getElementsByTagName("li")[i].innerText.replace(/删除/, "")) {
						plus.nativeUI.toast("添加内容不能重复", toastStyle);
						return;
					}
				}
				if(content.length > 30) {
					plus.nativeUI.toast("研究方向不得超过30个字", toastStyle);
					return;
				}
				var node = document.createElement("li");
				node.innerHTML = '<span class="numThis mui-pull-left">0</span><span class="otsave mui-pull-left">'+content + '</span><span class="closeThis">删除</span>';
				document.getElementsByClassName("labelshow")[0].appendChild(node);
				document.getElementsByTagName('input')[0].value = "";
				
			} else {
				plus.nativeUI.toast("请填写您的研究方向", toastStyle);
			}
		});
		document.getElementById('login').addEventListener("tap", function() {
			var $data = [];
			var researchAreas = document.getElementsByClassName("otsave");
			if(researchAreas.length > 0) {
				for(var i = 0; i < researchAreas.length; i++) {
					var $rd = {};
					$rd.professorId = userid;
					$rd.caption = researchAreas[i].innerText;
					$data[i] = $rd;
				}
			}
			var mess1 = JSON.stringify($data);
			console.log(mess1)
			$.ajax({
				"url": baseUrl + '/ajax/researchArea',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"beforeSend": function(xhr, settings) {
					console.log(JSON.stringify(settings))
				},
				"contentType": "application/json",
				"success": function(data) {
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("userInforUpdate.html");
						mui.fire(web, "newId", {
							
						});
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});
		});
	});
})