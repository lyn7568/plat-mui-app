mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.value = web.phone;
			if(web.phone.length) {
				document.getElementById("fontAdd").innerHTML = web.phone.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("input", function() {
				
					//this.value = this.value.substring(0, 20);
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
				if(document.getElementById("title").value.length>50) {
					plus.nativeUI.toast("联系方式不得超过50个字", toastStyle);
					return;
				}
			}
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department = web.department;
			mess.title = web.title;
			mess.office =web.office;	
			mess.address = web.address;
			mess.email = web.email;
			mess.province=web.province;
			mess.phone =document.getElementById("title").value;			
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
							var web = plus.webview.getWebviewById("updateBasic.html");
							mui.fire(web, "newId", {
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