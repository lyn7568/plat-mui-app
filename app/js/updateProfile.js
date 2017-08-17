mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		console.log(JSON.stringify(web));
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
				document.getElementById("tt").style.width=document.getElementById("title").scrollWidth+"px";
				document.getElementById("tt").value=web.descp;
				document.getElementById("title").style.height=document.getElementById("tt").scrollHeight+"px";
			title.value = web.descp;
			if(web.descp.length) {
				document.getElementById("fontAdd").innerHTML = web.descp.length;
			}
			document.getElementById("title").addEventListener("input", function() {
					document.getElementById("fontAdd").innerHTML = this.value.length;
			})
		}
		person();
		document.getElementById("login").addEventListener("tap",function(){
			 savePro();
		})
		function savePro() {
			if(document.getElementById("title").value.length>500) {
				plus.nativeUI.toast("个人简介不得超过500个字", toastStyle);
				return;
			}
			mui.ajax(baseUrl + '/ajax/professor/descp', {
				data: {
					"id": userid,
					"descp": document.getElementById("title").value
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						mui.back();
						var web = plus.webview.getWebviewById("userInforUpdate.html");
							mui.fire(web, "newId",{
									obre: document.getElementById("title").value
								});
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
	})
})