mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		console.log(JSON.stringify(web));
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.innerHTML = web.descp;
			if(web.descp.length) {
				document.getElementById("fontAdd").innerHTML = web.descp.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("keyup", function() {
				if(this.innerHTML.length > 500) {
					this.innerHTML = this.innerHTML.substring(0, 500);
				}else if(this.innerHTML.length>0) {
					document.getElementById("login").removeAttribute("disabled");
				}else if(this.innerHTML.length==0) {
					document.getElementById("login").setAttribute("disabled","true");
				}
				document.getElementById("fontAdd").innerHTML = this.innerHTML.length;
			})
		}
		person();
		document.getElementById("login").addEventListener("tap",function(){
			 savePro();
		})
		function savePro() {
			if(document.getElementById("title").innerHTML.length>500) {
				plus.nativeUI.toast("个人简介不得超过500个字", toastStyle);
				return;
			}
			mui.ajax(baseUrl + '/ajax/professor/descp', {
				data: {
					"id": userid,
					"descp": document.getElementById("title").innerHTML
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
									obre: document.getElementById("title").innerHTML
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