mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		var oDel = document.getElementById('del');
		var oLogin = document.getElementById("login");
		var project = document.getElementById("project");
		var startMonth = document.getElementById("startMonth");
		var stopMonth = document.getElementById("stopMonth");
		var descp = document.getElementById("descp");
		if(!ws.data) {
			oDel.classList.add("displayNone");
		} else {
			oLogin.removeAttribute("disabled");
			project.value = ws.data.name;
				document.getElementById("tt").value=ws.data.name;
				project.style.height=document.getElementById("tt").scrollHeight+"px";
			startMonth.innerHTML = (timeT(ws.data)) ? timeT(ws.data).substring(0, timeT(ws.data).indexOf("-")) : "请选择开始时间";
			stopMonth.innerHTML = (timeT(ws.data)) ? timeT(ws.data).substring(timeT(ws.data).indexOf("-") + 1, timeT(ws.data).length) : "请选择结束时间";
			descp.value = ws.data.descp;
			if(ws.data.descp) {
				document.getElementById("tt").style.width=document.getElementById("descp").scrollWidth+"px";
				document.getElementById("tt").value=ws.data.descp;
				descp.style.height=document.getElementById("tt").scrollHeight+"px";
			}
		}
		project.addEventListener("input", function() {
			if(this.value.length > 0) {
				document.getElementById("login").removeAttribute("disabled");
			} else if(this.value.length == 0) {
				document.getElementById("login").setAttribute("disabled", "true");
			}
		})

		function timeT(obj) {
			var a, b;
			if(obj.startMonth) {
				if(obj.startMonth.substring(4, 1) == 0) {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(5, 6) + "月";
				} else {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(4, 6) + "月";
				}
			} else {
				a = "";
			}
			if(obj.stopMonth) {
				if(obj.stopMonth.substring(4, 1) == 0) {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(5, 6) + "月";
				} else {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(4, 6) + "月";
				}
			} else {
				if(a) {
					b = "至今"
				} else {
					b = "";
					return "";
				}

			}
			return a + "-" + b;
		}

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		oLogin.addEventListener("tap", function() {
			var projectL = trim(project.value);
			var descpL = trim(descp.value);
			var startMonthL = startMonth.innerHTML;
			var stopMonthL = stopMonth.innerHTML;
			if(!projectL.length) {
				plus.nativeUI.toast("“请填写项目名称");
				return;
			}
			if(projectL.length > 50) {
				plus.nativeUI.toast("项目名称不得超过50个字");
				return;
			}
			if(descpL.length > 200) {
				plus.nativeUI.toast("项目描述不得超过200个字");
				return;
			}
			if(startMonthL.length != stopMonthL.length) {
				if(stopMonthL != "至今") {
					if(startMonthL.length==7) {
						plus.nativeUI.toast("请选择项目的开始时间");
						return;
					} else {
						plus.nativeUI.toast("请选择项目的结束时间");
						return;
					}
				}

			}
			savePro();

		})

		function savePro() {
			var $data = {};
			$data.professorId = userid;
			$data.name = project.value;
			if(startMonth.innerHTML) {
				if(startMonth.innerHTML.length != 7) {
					$data.startMonth = startMonth.innerHTML.substring(0, 4) + startMonth.innerHTML.substring(5, 7);
				}
			}
			if(stopMonth.innerHTML) {
				if(stopMonth.innerHTML != "至今") {
					if(stopMonth.innerHTML.length != 7) {
						console.log(stopMonth.innerHTML);
						$data.stopMonth = stopMonth.innerHTML.substring(0, 4) + stopMonth.innerHTML.substring(5, 7);
					}

				}
			}
			$data.descp = descp.value;
			if(ws.data) {
				$data.id = ws.data.id;
			}
			console.log(JSON.stringify($data));
			$.ajax({
				"url": baseUrl + "/ajax/project",
				"type": ws.data ? "put" : "post",
				"async": true,
				"data": ws.data ? JSON.stringify($data) : $data,
				"contentType": ws.data ? "application/json" : "application/x-www-form-urlencoded",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateProject.html");
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
				mui.confirm("确认删除该项目经历？", "提示", btn, function(e) {
					if(e.index == 0) {
						delf();
					}
				})
			});
		}

		function delf() {
			$.ajax({
				"url": baseUrl + "/ajax/project/" + ws.data.id,
				"type": "DELETE",
				"success": function($data) {
					if($data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateProject.html");
						mui.fire(web, "newId", {
								rd: 1
							});
						mui.back();
						var Page = plus.webview.getWebviewById('userInforUpdate.html');
							mui.fire(Page, 'newId', {
								rd: 1
							});
					}
				}
			});
		}
	});
})