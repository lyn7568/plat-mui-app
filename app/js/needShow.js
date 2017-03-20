mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		if(ws.demandStatus1==0){
			document.getElementById("closedDemand").style.display="none";	
		}
		/*单个需求查询*/
		function demandAngle() {
			mui.ajax(baseUrl + '/ajax/demand/queryOne', {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"demandId": ws.demanid
				},
				success: function(data) {
					if(data.success) {
						var $data = data.data;
						var oDemandTitle = document.getElementById("demandTitle");
						var oDemandContent = document.getElementById("demandContent");
						var oDemandType = document.getElementById("oDemandType");
						var oDemandAim = document.getElementById("oDemandAim");
						var oDemandStatus = document.getElementById("oDemandStatus");
						var oCreateTime = document.getElementById("poTime");
						//						
						oCreateTime.innerText = $data.createTime.substr(4, 2) + "-" + $data.createTime.substr(6, 2)
						oDemandTitle.innerText = $data.demandTitle;
						oDemandContent.innerText = $data.demandContent;
						($data.demandStatus == 1) ? oDemandStatus.innerText = "发布中": (oDemandStatus.innerText = "已关闭",oDemandStatus.classList.remove('status-1'),oDemandStatus.classList.add('status-5'));
						($data.demandType == 1) ? oDemandType.innerText = "个人需求": oDemandType.innerText = "企业需求";
						($data.demandAim == 1) ? oDemandAim.innerText = "技术咨询": ($data.demandAim == 2) ? oDemandAim.innerText = "资源合作" : oDemandAim.innerText = "其他事务";
						plus.nativeUI.closeWaiting();
						ws.show("slide-in-right", 150);
					}

				}
			});
		}
		demandAngle();
		/*关闭单个需求*/
		document.getElementById("closedDemand").addEventListener("tap", function() {
			mui.ajax(baseUrl + '/ajax/demand/close', {
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"demandId": ws.demanid
				},
				success: function(data) {
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("../html/needList.html");
						mui.fire(web, "newId");
						setTimeout(function(){mui.back()},1000);
					}

				}
			});
		})
	});
})