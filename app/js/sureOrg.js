mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		var organName=""
		function person(orgName) {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.value = orgName;
			document.getElementById("tt").value = orgName;
			title.style.height = document.getElementById("tt").scrollHeight + "px";
			if(orgName.length) {
				document.getElementById("fontAdd").innerHTML = orgName.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			
		}
		document.getElementById("title").addEventListener("input", function() {
				if(this.value == "") {
					document.getElementById("login").disabled = "disabled";
				} else {
					document.getElementById("login").removeAttribute("disabled");
				}
				document.getElementById("fontAdd").innerHTML = this.value.length;
			})
		document.getElementById("login").addEventListener("tap", function() {
			if(document.getElementById("title").value.length) {
				if(document.getElementById("title").value.length>50) {
					plus.nativeUI.toast("机构名称不可超过50个字", toastStyle);
					return;
				}
			}
			if(organName==document.querySelector("#title").value) {
				mui.openWindow({
							url: '../html/demandPublish.html',
							id: 'demandPublish.html',
							show: {
								autoShow: true,
								aniShow: "slide-in-right"
							}
						});
			}else{
				
						savePro();
			}
			
		})
		orName()
		// 获取企业名字
		function orName() {
			mui.ajax(baseUrl + "/ajax/professor/baseInfo/" + plus.storage.getItem('userid'), {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				//async: false,
				success: function(data) {
					if(data.success && data.data) {
						var $info = data.data || {};
						if($info.orgName) {
							person($info.orgName);
							organName=$info.orgName;
						}else{
							document.getElementById("login").disabled = "disabled";
							organName="undefined"
						}
						
						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function savePro() {
			console.log(plus.storage.getItem('userid'))
			var ccc={
					"id": plus.storage.getItem('userid'),
					"name": document.getElementById("title").value
				}
			$.ajax({
				"url": baseUrl + '/ajax/professor/org',
				"type": "POST",
				"async": true,
				"data": ccc,
				"beforeSend":function(){
					console.log(JSON.stringify(ccc));
				},
				"success": function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						mui.openWindow({
							url: '../html/demandPublish.html',
							id: 'demandPublish.html',
							show: {
								autoShow: true,
								aniShow: "slide-in-right"
							}
						});
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})