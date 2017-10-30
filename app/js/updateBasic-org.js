mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.value = web.orgName;
			document.getElementById("tt").value=web.orgName;
				title.style.height=document.getElementById("tt").scrollHeight+"px";
			if(web.orgName.length) {
				document.getElementById("fontAdd").innerHTML = web.orgName.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("input", function() {
					document.getElementById("fontAdd").innerHTML = this.value.length;
			})
		}
		person();
		document.getElementById("login").addEventListener("tap",function(){
			if(web.orgName==document.getElementById("title").value) {
				mui.back();
				return;
			}
			if(web.orgAuth==1) {
				var btn = ["确定", "取消"];
				mui.confirm("您修改了所在机构，认证员工身份将失效，为企业发布的需求也将关闭，确定修改？", "提示", btn, function(e) {
					if(e.index == 0) {
						savePro();
					}
				})
			}else{
				var btn = ["确定", "取消"];
				mui.confirm("您修改了所在机构，您为企业发布的需求将关闭，确定修改？", "提示", btn, function(e) {
					if(e.index == 0) {
						savePro();
					}
				})
			}
			 
		})
		
		function savePro() {
			var mess = {};
			if(document.getElementById("title").value.length) {
				if(document.getElementById("title").value.length>50) {
					plus.nativeUI.toast("所在机构不得超过50个字", toastStyle);
					return;
				}
			}
			mess.name = web.name;
			mess.orgName = document.getElementById("title").value;
			mess.department =web.department;
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
					console.log(JSON.stringify(data));
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