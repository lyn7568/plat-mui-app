mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.value = web.title;
			if(web.title.length) {
				document.getElementById("fontAdd").innerHTML = web.title.length;
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
			var mess = {};
			if(document.getElementById("title").value.length) {
				if(document.getElementById("title").value.length>20) {
					plus.nativeUI.toast("职称不得超过20个字", toastStyle);
					return;
				}
			}
			mess.sex=web.sex;
			mess.birthday=web.birthday;
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department = web.department;
			mess.title = document.getElementById("title").value;
			mess.office =web.office;	
			mess.address = web.address;
			mess.province=web.province;
			mess.email = web.email;
			mess.phone =web.phone;			
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
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
							var web1 = plus.webview.getWebviewById("updateBasic.html");
							mui.fire(web1, "newId", {
								rd: 1
							});
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})