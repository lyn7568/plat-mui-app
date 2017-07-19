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
		var otitle=document.getElementById('title');
		var descp = document.getElementById("descp");
		console.log(JSON.stringify(ws.data));
		if(!ws.data) {
			oDel.classList.add("displayNone");
			oLogin.removeAttribute("disabled");
		} else {
			console.log(JSON.stringify(ws.data));
			oLogin.removeAttribute("disabled");
			project.innerHTML = (ws.data.company) ? ws.data.company : "";
			startMonth.innerHTML = (timeT(ws.data)) ? timeT(ws.data).substring(0, timeT(ws.data).indexOf("-")) : "请选择开始时间";
			stopMonth.innerHTML = (timeT(ws.data)) ? timeT(ws.data).substring(timeT(ws.data).indexOf("-") + 1, timeT(ws.data).length) : "请选择结束时间";
			descp.innerHTML = (ws.data.department) ? ws.data.department : "";
			otitle.innerHTML = (ws.data.title) ? ws.data.title : "";
		}

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
			var projectL = trim(project.innerHTML);
			var descpL = trim(descp.innerHTML);
			var startMonthL = startMonth.innerHTML;
			var stopMonthL = stopMonth.innerHTML;
			var ti=otitle.innerHTML;
			if(!projectL.length) {
				plus.nativeUI.toast("请填写机构名称");
				return;
			}
			if(projectL.length > 50) {
				plus.nativeUI.toast("机构名称不得超过50个字");
				return;
			}
			if(descpL.length > 20) {
				plus.nativeUI.toast("部门名称不得超过20个字");
				return;
			}
			if(!ti.length) {
				plus.nativeUI.toast("请填写职称");
				return;
			}
			if(ti.length > 20) {
				plus.nativeUI.toast("职位不得超过20个字");
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
			$data.company = project.innerHTML;
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
			$data.title=otitle.innerHTML;
			$data.department = descp.innerHTML;
			if(ws.data) {
				$data.id = ws.data.id;
			}
			console.log(JSON.stringify($data));
			$.ajax({
				"url": baseUrl + "/ajax/job",
				"type": ws.data ? "put" : "post",
				"async": true,
				"data": ws.data ? JSON.stringify($data) : $data,
				"contentType": ws.data ? "application/json" : "application/x-www-form-urlencoded",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateJob.html");
						mui.fire(web, "newId");
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
				"url": baseUrl + "/ajax/job" + ws.data.id,
				"type": "DELETE",
				"success": function($data) {
					if($data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateProject.html");
						mui.fire(web, "newId");
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