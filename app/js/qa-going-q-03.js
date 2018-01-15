mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var title = plus.webview.getWebviewById("qa-going-q-02.html").title;
		var ws = plus.webview.currentWebview();
		var cnt = ws.cnt;
		var img = ws.img;	
			plus.nativeUI.closeWaiting();
			ws.show("slide-in-right", 150);
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
		if(ws.keys) {
			subjectShow(ws.keys);
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
				if(oleng.length >= 5) {
					plus.nativeUI.toast("最多添加5个关键词", toastStyle);
					return;
				}
				for(var i = 0; i < document.getElementsByTagName("li").length; i++) {
					if(content == document.getElementsByTagName("li")[i].innerText.replace(/删除/, "")) {
						plus.nativeUI.toast("添加内容不能重复", toastStyle);
						return;
					}
				}
				if(content.length > 15) {
					plus.nativeUI.toast("关键词不得超过15个字", toastStyle);
					return;
				}
				var node = document.createElement("li");
				node.innerHTML = content + '<span class="closeThis">删除</span>';
				document.getElementsByClassName("labelshow")[0].appendChild(node);
				document.getElementsByTagName('input')[0].value = "";
				
			} else {
				plus.nativeUI.toast("请填写问题的关键词", toastStyle);
			}
		});
		document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
			var subjects = document.getElementsByTagName("li");
			var subjectAll = "";
			if(subjects.length > 0) {
				for(var i = 0; i < subjects.length; i++) {
					subjectAll += subjects[i].innerText.replace(/删除/, "");
					subjectAll += ',';
				};
				subjectAll = subjectAll.substring(0, subjectAll.length - 1);
			}else{
				plus.nativeUI.toast("请至少添加1个关键词", toastStyle);
				return;
			}
			console.log(subjectAll);
			console.log(img);
			mui.ajax(baseUrl + '/ajax/question', {
				data: {
					"title": title,
					"cnt": cnt,
					"img": img,
					"keys": subjectAll,
					"uid": userid
				},
				dataType: 'json',
				traditional: true,
				async: false,
				type: 'POST', 
				success: function(data) {
					if(data.success) {
						//console.log(JSON.stringify(data))
						plus.nativeUI.toast("问题发布成功", toastStyle);
						var w2 = plus.webview.getWebviewById('qa-going-q-02.html');
						var w1 = plus.webview.getWebviewById('qa-going-q-01.html');
					  	plus.webview.close(ws);
					  	plus.webview.close(w2);
					  	plus.webview.close(w1);
					}
				}
			});
		});
	});
})