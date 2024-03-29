mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		var oDel = document.getElementById('del');
		var oLogin = document.getElementById("login");
		var project = document.getElementById("project");
		var yearResult = document.getElementById("yearResult");
		var descp = document.getElementById("descp");
		if(!ws.data) {
			oDel.classList.add("displayNone");
		} else {
			oLogin.removeAttribute("disabled");
			document.getElementById("tt").value=ws.data.name;
			project.style.height=document.getElementById("tt").scrollHeight+"px";
			project.value = (ws.data.name) ? ws.data.name : "";
			yearResult.innerHTML =(ws.data.year) ? ws.data.year+"年" : "请选择获奖时间";
			if(ws.data.descp) {
				document.getElementById("tt").style.width=document.getElementById("descp").scrollWidth+"px";
				document.getElementById("tt").value=ws.data.descp;
				descp.style.height=document.getElementById("tt").scrollHeight+"px";
			}
			descp.value = (ws.data.descp) ? ws.data.descp : "";
		}
		project.addEventListener("input", function() {
			if(this.value.length > 0) {
				document.getElementById("login").removeAttribute("disabled");
			} else if(this.value.length == 0) {
				document.getElementById("login").setAttribute("disabled", "true");
			}
		})
		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		oLogin.addEventListener("tap", function() {
			var projectL = trim(project.value);
			var descpL = trim(descp.value);
			var startMonthL = yearResult.innerHTML;
			if(!projectL.length) {
				plus.nativeUI.toast("“请填写奖项名称");
				return;
			}
			if(projectL.length > 50) {
				plus.nativeUI.toast("奖项名称不得超过50个字");
				return;
			}
			if(descpL.length > 200) {
				plus.nativeUI.toast("获奖描述不得超过200个字");
				return;
			}
			savePro();

		})

		function savePro() {
			var $data = {};
			$data.professorId = userid;
			$data.name = project.value;
			if(yearResult.innerHTML.length!=7) {
					$data.year = yearResult.innerHTML.substring(0, 4);
			}
			if(descp.value!="请填写获奖描述(200个字以内)")
			$data.descp = descp.value;
			if(ws.data) {
				$data.id = ws.data.id;
			}
			console.log(JSON.stringify($data));
			$.ajax({
				"url": baseUrl + "/ajax/honor",
				"type": ws.data ? "put" : "post",
				"async": true,
				"data": ws.data ? JSON.stringify($data) : $data,
				"contentType": ws.data ? "application/json" : "application/x-www-form-urlencoded",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateHonor.html");
						mui.fire(web, "newId", {
								rd: 1
							});
						mui.back();
						var Page = plus.webview.getWebviewById('userInforUpdate.html');
							mui.fire(Page, 'newId', {
								rd: 1
							});
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});
		}
		if(ws.data) {
			oDel.addEventListener("click", function() {
				var btn = ["确认", "取消"];
				mui.confirm("确认删除该荣誉奖项？", "提示", btn, function(e) {
					if(e.index == 0) {
						delf();
					}
				})
			});
		}

		function delf() {			
			$.ajax({
				"url": baseUrl + "/ajax/honor/" + ws.data.id,
				"type": "DELETE",
				"success": function($data) {
					console.log(JSON.stringify($data));
					if($data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateHonor.html");
						mui.fire(web, "newId", {
								rd: 1
							});
						mui.back();
						var Page = plus.webview.getWebviewById('userInforUpdate.html');
							mui.fire(Page, 'newId', {
								rd: 1
							});
					}
				},
				"error":function(xhr){
					console.log(JSON.stringify(xhr));
				}
			});
		}
	});
})