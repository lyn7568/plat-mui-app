mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var oUlist = document.getElementsByClassName("tableList")[0];
		window.addEventListener("newId", function(event) {
			demandList();
		})

		function demandHtml(data) {
			for(var i = 0; i < data.length; i++) {
				var oDemandStatus, oDemandType, oDemandAim, oCreateTime, stColor;
				(data[i].demandStatus == 1) ? (oDemandStatus = "发布中", stColor = "status-1") : (oDemandStatus = "已关闭", stColor = "status-5");
				(data[i].demandType == 1) ? oDemandType = "个人": oDemandType = "企业";
				(data[i].demandAim == 1) ? oDemandAim = "技术": (data[i].demandAim == 2) ? oDemandAim = "资源" : oDemandAim = "其他";
				oCreateTime = data[i].createTime.substr(0, 4) + "-" + data[i].createTime.substr(4, 2) + "-" + data[i].createTime.substr(6, 2) + " " + data[i].createTime.substr(8, 2) + ":" + data[i].createTime.substr(10, 2);
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				li.setAttribute("demandId", data[i].demandId);
				li.setAttribute("demandStatus", data[i].demandStatus);
				var oString = '<div class="coutopicbox"><span class="coutheme mui-ellipsis mui-pull-left">' + data[i].demandTitle + '</span>'
				oString += '<div class="coustatus mui-pull-right">'
				oString += '<span class="aimlabel">' + oDemandType + '</span>'
				oString += '<span class="aimlabel">' + oDemandAim + '</span>'
				oString += '<span class="' + stColor + '">' + oDemandStatus + '</span>'
				oString += '</div></div>'
				oString += '<a class="proinfor itemBtn">'
				oString += '<div class="mui-media-body">'
				oString += '<span class="listtit">'
				oString += '<span class="thistime" style="top:20px">' + oCreateTime + '</span>'
				oString += '</span>'
				oString += '<p class="listtit3 mui-ellipsis-2 rightChevron" style="width:90%;">' + data[i].demandContent + '</p></div></a>'
				li.innerHTML = oString;
				oUlist.appendChild(li);
			}
		}

		function demandList() {
			mui.ajax(baseUrl + '/ajax/demand/byDemander', {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"demander": userid
				},
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data));
						oUlist.innerHTML = "";
						demandHtml(data.data);
						plus.nativeUI.closeWaiting();; //新webview的载入完毕后关闭等待框
						ws.show("slide-in-right", 150);
					}

				}
			});
		}
		demandList();
		/*查询单个需求*/
		mui('.tableList').on('tap', 'li', function(e) {
			var oDemandId = this.getAttribute('demandId');
			var demandStatus = this.getAttribute('demandStatus');
			mui.openWindow({
				url: '../html/needShow.html',
				id: '../html/needShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right"
				},
				extras: {
					demanid: oDemandId,
					demandStatus1: demandStatus
				}

			});
		});
		/*发布新需求*/
		document.getElementById("btnLinkBox").addEventListener("tap", function() {
			mui.ajax(baseUrl + "/ajax/professor/auth", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"id": userid
				},
				success: function(data) {
					if(data.success) {
						var $data = data.data;
						if($data.authStatus == 3) {
							mui.openWindow({
								url: '../html/needIssue.html',
								id: '../html/needIssue.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-right",
								}
							});
						} else if($data.authStatus == 2) {
							plus.nativeUI.toast("我们正在对您的信息进行认证，请稍等片刻", {
								'verticalAlign': 'center'
							});
						} else if($data.authStatus == 1) {
							plus.nativeUI.toast("我们将尽快对您的信息进行认证", {
								'verticalAlign': 'center'
							});
						} else if($data.authStatus <= 0) {
							mui.openWindow({
								url: '../html/realname-authentication.html',
								id: 'realname-authentication.html',
								show: {
									aniShow: "slide-in-right",
								}
							});
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		})

	});
})