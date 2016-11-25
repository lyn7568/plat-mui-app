mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/resource/" + ws.rsId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					console.log(JSON.stringify(data))
					var $data = data.data;
					//合作备注
					if($data.cooperationNotes)
						document.getElementsByClassName("textareabox ")[0].innerText = $data.cooperationNotes;
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		document.getElementsByClassName("topsave")[0].addEventListener("tap", function() {
			console.log(document.getElementsByClassName("textareabox ")[0].innerText)
			mui.ajax(baseUrl + '/ajax/resource/cooperationNotes', {
				data: {
					"resourceId": ws.rsId,
					"cooperationNotes": document.getElementsByClassName("textareabox ")[0].innerText
				},
				dataType: 'json', //数据格式类型
				async: true,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var web = plus.webview.getWebviewById("resinforupdate.html");
						mui.fire(web, "resourceMess");
						mui.back();
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		});
		personalMessage();
	});
})