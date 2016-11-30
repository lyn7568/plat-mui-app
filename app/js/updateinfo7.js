mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');	
		console.log(userid);
		var ws=plus.webview.currentWebview();		
		var str = JSON.stringify(ws);	
		console.log(str);
		var oDt = document.getElementsByClassName("frmtype");
		var oDegree;
		if(ws.edu) {
			$.ajax({
				"url": baseUrl + "/ajax/job/" + ws.edu,
				"type": "get",
				"async": true,
				"success": function($data) {
					if($data.success) {
						plus.nativeUI.closeWaiting();; //新webview的载入完毕后关闭等待框
						ws.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画    
						$info = $data.data;
						oDt[0].value = $info.company;
						oDt[1].value = $info.department;
						oDt[2].value = $info.title;
						if($info.startMonth) {
							oDt[3].innerText = $info.startMonth.substr(0, 4) + "-" + $info.startMonth.substr(4, 6)
						} else {
							oDt[3].innerText = ""
						}
						if($info.startMonth) {
							oDt[4].innerText = $info.startMonth.substr(0, 4) + "-" + $info.startMonth.substr(4, 6)
						} else {
							oDt[4].innerText = ""
						}
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});

		}

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		oDt[0].addEventListener("blur", function() {
			var length = trim(oDt[0].value);
			if(!length)
				plus.nativeUI.toast("机构名称不能为空");
		});
		oDt[2].addEventListener("blur", function() {
			var length = trim(oDt[2].value);
			if(!length)
				plus.nativeUI.toast("职位不能为空");
		});
		oDt[3].addEventListener("change", function() {
			oDegree = oDt[3].value;
		});

		var oStartTime = document.getElementById("startTime");
		var oStopTime = document.getElementById("stopTime");
		mui(".timebox").on("click", ".btn", function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var flag = this.getAttribute('flag');
			console.log(flag);
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				if(flag) {
					oStartTime.innerText = rs.text;
				} else {
					oStopTime.innerText = rs.text;
				}
			});

		});

		function savePro() {
			var $data = {};
			$data.professorId = userid;
			$data.company = oDt[0].value;
			$data.department = oDt[1].value;
			$data.title = oDt[2].value;
			$data.startMonth = oDt[3].innerText.substr(0, 4) + oDt[3].innerText.substr(5, 7);
			$data.stopMonth = oDt[4].innerText.substr(0, 4) + oDt[4].innerText.substr(5, 7);
			if(ws.edu) {
				$data.id=ws.edu;
			}			
    		$.ajax({
				"url" :baseUrl+"/ajax/job",
				"type" : ws.edu?"put" :"post",
				"async":true,
				"data" :ws.edu?JSON.stringify($data):$data,
				"contentType" : ws.edu ? "application/json"
						: "application/x-www-form-urlencoded",
				"success" : function(data) {
					var y=JSON.stringify(data)					
					if (data.success) 
					{
						var web=plus.webview.getWebviewById("proinforupdate-more.html");
						mui.fire(web,"newId");						
						mui.back();
					} 
					else
					{
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
					}
				}
			});			
		}
    	
    	document.getElementsByClassName("topsave")[0].addEventListener("click",function(){
    		var length1=trim(oDt[0].value);    		
    		var length2=trim(oDt[2].value);   		
    		if(length1&&length2) {    			
    			savePro();
    		}else if(!length1&&length2) {
    			plus.nativeUI.toast("机构名称不能为空");
    		}else if(length1&&!length2) {
    			plus.nativeUI.toast("职位不能为空");
    		}else if(!length1&&!length2) {
    			plus.nativeUI.toast("机构名称不能为空&&职位不能为空");
    		}  		
    	});
    	if(ws.edu) 
    	document.getElementsByClassName("exitbtn")[0].addEventListener("click",function(){
    		$.ajax({
					"url" : baseUrl+"/ajax/job/" + ws.edu,
					"type" : "DELETE",
					"success" : function($data) {
						if ($data.success) {
							var web=plus.webview.getWebviewById("proinforupdate-more.html");
							mui.fire(web,"newId");						
							mui.back();
						}
						else {
							alert($data.msg);
						}
					}
				});
    	});
	});
})          