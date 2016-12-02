mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var oDt = document.getElementsByClassName("frmtype");
		var service = document.getElementsByClassName("textareabox");

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/resource/" + ws.rsId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					var $data = data.data;
					//资源基本信息
					oDt[0].value = $data.resourceName;
					service[0].innerText = $data.supportedServices
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function trim(str) { //删除左右两端的空格			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		oDt[0].addEventListener("blur", function() {
			var length = trim(oDt[0].value);
			if(!length)
				plus.nativeUI.toast("资源名称不能为空");
		});
		service[0].addEventListener("blur", function() {
			var length = trim(service[0].innerText);
			if(!length)
				plus.nativeUI.toast("应用用途不能为空");
		});

		function savePro() {
			var $data = {};
			$data.resourceName = oDt[0].value;
			$data.supportedServices = service[0].innerText;
			if(ws.rsId) {
				$data.resourceId = ws.rsId;
				mui.ajax(baseUrl + "/ajax/resource/nameAndSupport", {
					"type": "post",
					"async": true,
					"data": $data,
					"error": function(type, xhr, errorThrown) {
						console.log(JSON.stringify(type));
						console.log(JSON.stringify(xhr));
						console.log(JSON.stringify(errorThrown));
					},
					"success": function(data) {
						var y = JSON.stringify(data)
						if(data.success) {
							var web = plus.webview.getWebviewById("resinforupdate.html");
							mui.fire(web, "resourceMess");
							mui.back();
							var web1 = plus.webview.getWebviewById("html/proinforupdate.html"); 
							mui.fire(web1,"newId",{rd:1});  
							
						} else {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
							return;
						}
					}
				});
			} else {
				$data.professorId = userid;
				mui.ajax(baseUrl + "/ajax/resource", {
					"type": "post",
					"async": true,
					"data": $data,
					"success": function(data) {
						var y = JSON.stringify(data)
						if(data.success) {							
							var id = data.data;
							plus.nativeUI.showWaiting();
							var web2 = plus.webview.getWebviewById("html/proinforupdate.html"); 
							mui.fire(web2,"newId",{rd:1});
							var web = plus.webview.create("../html/resinforupdate.html", "resinforupdate.html", {}, {
								resourceId: id
							}); //后台创建webview并打开show.html   	    	
							web.addEventListener("loaded", function() {}, false);
						} else {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
							return;
						}
					}
				});
			}

		}
		if(ws.rsId) {
			personalMessage()
		}
		document.getElementsByClassName("topsave")[0].addEventListener("click", function() {
			var length1 = trim(oDt[0].value);
			var length2 = trim(service[0].innerText);
			if(length1 && length2) {
				savePro();
			} else if(!length1 && length2) {
				plus.nativeUI.toast("资源名称不能为空");
			} else if(length1 && !length2) {
				plus.nativeUI.toast("应用用途不能为空");
			} else if(!length1 && !length2) {
				plus.nativeUI.toast("资源名称不能为空&&应用用途不能为空");
			}
		});

	});
})