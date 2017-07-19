mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		var upStatus = function() {
			mui.ajax(baseUrl + "/ajax/professor/removeOrgAuth", {
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				data: {
					id: userid
				},
				timeout: 10000, //超时设置				
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						
					} else {

					}
				}
			})
		}
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.innerHTML = web.orgName;
			if(web.orgName.length) {
				document.getElementById("fontAdd").innerHTML = web.orgName.length;
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
			if(web.orgName==document.getElementById("title").innerHTML) {
				mui.back();
				return;
			}
			if(web.orgAuth==1) {
				var btn = ["确定", "取消"];
				mui.confirm("您修改了所在机构，员工认证即将失效，确认修改？", "提示", btn, function(e) {
					if(e.index == 0) {
						savePro();
					}
				})
			}else{
				savePro();
			}
			 
		})
		
		function savePro() {
			var mess = {};
			if(document.getElementById("title").innerHTML.length) {
				if(document.getElementById("title").innerHTML.length>20) {
					plus.nativeUI.toast("所在机构不得超过50个字", toastStyle);
					return;
				}
			}
			if(web.orgAuth==1) {
				upStatus();
			}
			mess.name = web.name;
			mess.orgName = document.getElementById("title").innerHTML;
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