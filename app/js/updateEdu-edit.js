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
		var college = document.getElementById("college");
		var major = document.getElementById("major");
		var degreeResult = document.getElementById("degreeResult");
		var oDe={
			0:"请选择获得的学位",
			1:"博士",
			2:"硕士",
			3:"学士",
			4:"大专",
			5:"其他"
		}
		console.log(JSON.stringify(ws.data));
		if(!ws.data) {
			oDel.classList.add("displayNone");
		} else {
			oLogin.removeAttribute("disabled");
			document.getElementById("tt").value=ws.data.school;
			project.style.height=document.getElementById("tt").scrollHeight+"px";
			project.value = (ws.data.school) ? ws.data.school : "";
			if(ws.data.college) {
				document.getElementById("tt").value=ws.data.college;
			college.style.height=document.getElementById("tt").scrollHeight+"px";
			}
			college.value = (ws.data.college) ? ws.data.college : "";
			if(ws.data.major) {
				document.getElementById("tt").value=ws.data.major;
			major.style.height=document.getElementById("tt").scrollHeight+"px";
			}
			major.value = (ws.data.major) ? ws.data.major : "";
			degreeResult.innerHTML = (ws.data.degree) ? oDe[ws.data.degree] : "请选择获得的学位";
			yearResult.innerHTML =(ws.data.year) ? ((ws.data.year!="至今 ")?(ws.data.year+"年"):"至今") : "请选择毕业时间";
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
			var startMonthL = yearResult.innerHTML;
			if(!projectL.length) {
				if(projectL=="请填写就读的学校(50个字以内)") {
					plus.nativeUI.toast("“请填写学校名称");
				return;
				}
				
			}
			if(projectL.length > 50) {
				plus.nativeUI.toast("学校名称不得超过50个字");
				return;
			}
			if(college.value!="请填写就读的院系(20个字以内)") {
				if(college.value.length>20) {
					plus.nativeUI.toast("院系名称不得超过20个字");
					return;
				}
				
			}
			if(major.value!="请填写就读的专业(20个字以内)") {
				if(college.value.length>20) {
					plus.nativeUI.toast("专业名称不得超过20个字");
					return;
				}
				
			}
			savePro();

		})

		function savePro() {
			var $data = {};
			$data.professorId = userid;
			$data.school = project.value;
			if(yearResult.innerHTML.length!=7) {
				if(yearResult.innerHTML.length==5) {	
					$data.year = yearResult.innerHTML.substring(0, 4);
					}else{
						$data.year = "至今";
					}
			}
			if(degreeResult.innerHTML=="博士") {
				$data.degree=1;
			}else if(degreeResult.innerHTML=="硕士") {
				$data.degree=2;
			}else if(degreeResult.innerHTML=="学士") {
				$data.degree=3;
			}else if(degreeResult.innerHTML=="大专") {
				$data.degree=4;
			}else if(degreeResult.innerHTML=="其他") {
				$data.degree=5;
			}
			if(college.value!="请填写就读的院系(20个字以内)") {
				if(college.value.length>0) {
					$data.college=college.value;
				}
				
			}
			if(major.value!="请填写就读的专业(20个字以内)") {
				if(major.value.length>0) {
					$data.major=major.value;
				}
				
			}
			if(ws.data) {
				$data.id = ws.data.id;
			}
			console.log(JSON.stringify($data));
			$.ajax({
				"url": baseUrl + '/ajax/edu',
				"type": ws.data ? "put" : "post",
				"async": true,
				"data": ws.data ? JSON.stringify($data) : $data,
				"contentType": ws.data ? "application/json" : "application/x-www-form-urlencoded",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateEdu.html");
						mui.fire(web, "newId",{
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
				mui.confirm("确认删除该教育背景？", "提示", btn, function(e) {
					if(e.index == 0) {
						delf();
					}
				})
			});
		}

		function delf() {
			$.ajax({
				"url": baseUrl + '/ajax/edu/' + ws.data.id,
				"type": "DELETE",
				"success": function($data) {
					if($data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateEdu.html");
						mui.fire(web, "newId",{
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
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
	});
})