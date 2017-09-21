mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.value = web.name;
			document.getElementById("tt").value=web.name;
				title.style.height=document.getElementById("tt").scrollHeight+"px";
			if(web.name.length) {
				document.getElementById("fontAdd").innerHTML = web.name.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("input", function() {
					document.getElementById("fontAdd").innerHTML = this.value.length;
			})
		}
		person();
		document.getElementById("login").addEventListener("tap",function(){
			if(web.name==document.getElementById("title").value) {
				mui.back();
				return;
			}
			var btn = ["确定", "取消"];
				mui.confirm("您修改了姓名，您的专利和论文将取消关联，确定修改？", "提示", btn, function(e) {
					if(e.index == 0) {
						savePro();
					}
				}) 	
		})
		
		function savePro() {
			var mess = {};
			if(document.getElementById("title").value.length) {
				if(document.getElementById("title").value.length>50) {
					plus.nativeUI.toast("姓名不得超过10个字", toastStyle);
					return;
				}
			}
			mess.name = document.getElementById("title").value;
			mess.orgName = web.orgName ;
			mess.department =web.department;
			mess.title = web.title;
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
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateBasic.html");
						mui.fire(web, "newId", {
								rd: 1
							});
						var Pa = plus.webview.getWebviewById('html/myaccount.html');
						mui.fire(Pa, 'photoUser');
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})