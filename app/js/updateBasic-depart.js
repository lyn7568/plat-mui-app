mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.innerHTML = web.department;
			if(web.department.length) {
				document.getElementById("fontAdd").innerHTML = web.department.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("keyup", function() {
				if(this.innerHTML.length > 20) {
					this.innerHTML = this.innerHTML.substring(0, 20);
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
			var mess = {};
			if(document.getElementById("title").innerHTML.length) {
				if(document.getElementById("title").innerHTML.length>20) {
					plus.nativeUI.toast("所属部门不得超过20个字", toastStyle);
					return;
				}
			}
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department = document.getElementById("title").innerHTML;
			mess.title = web.title;
			mess.office =web.office;	
			mess.address = web.address;
			mess.province=web.province;
			mess.email = web.email;
			mess.phone =web.phone;			
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
			console.log(JSON.stringify(mess))
			$.ajax({
				"url": baseUrl + '/ajax/professor',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"contentType": "application/json",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
							var aa = plus.webview.getWebviewById("updateBasic.html");
							mui.fire(aa, "newId", {
								rd: 1
							});
						
						web.back();
						
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})