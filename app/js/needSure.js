mui.ready(function() {
	mui.plusReady(function() {
		var ws = plus.webview.currentWebview();
		var userid = plus.storage.getItem('userid');
		var conId, denmandTitle, demandContent, demandType,data3;
		console.log(ws.deman);
		/*单个需求查询*/
		function demandAngle() {
			mui.ajax(baseUrl + '/ajax/demand/queryOne', {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"demandId": ws.deman
				},
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						var oDemandTitle = document.getElementById("demandTitle");
						var oDemandContent = document.getElementById("demandContent");
						var oDemandType = document.getElementById("oDemandType");
						var oDemandAim = document.getElementById("oDemandAim");
						var oDemandStatus = document.getElementById("oDemandStatus");
						var oCreateTime = document.getElementById("poTime");
						var proZlist = document.getElementById("proZlist"); //专家资源
						var proRlist = document.getElementById("proRlist"); //专家资源
						var proName = document.getElementById("proName");
						var proTitle = document.getElementById("proTitle");
						var proOffice = document.getElementById("proOffice");
						var proOrg = document.getElementById("proOrg");
						var proAddress = document.getElementById("proAddress");
						conId = $info.professor.id;
						denmandTitle = $info.demandTitle;
						demandContent = $info.demandContent;
						demandType = $info.demandAim
						proName.innerText = $info.professor.name;
						oCreateTime.innerText = $info.createTime.substr(0, 4) + "-" + $info.createTime.substr(4, 2) + "-" + $info.createTime.substr(6, 2) + " " + $info.createTime.substr(8, 2) + ":" + $info.createTime.substr(10, 2);
						oDemandTitle.innerText = $info.demandTitle;
						oDemandContent.innerText = $info.demandContent;
						($info.demandType == 1) ? oDemandType.innerText = "个人需求": oDemandType.innerText = "企业需求";
						($info.demandAim == 1) ? oDemandAim.innerText = "技术咨询": ($info.demandAim == 2) ? oDemandAim.innerText = "资源合作" : oDemandAim.innerText = "其他事务";
						if($info.professor.title && $info.professor.office && $info.professor.orgName && $info.professor.address) {
							proTitle.innerText = $info.professor.title + "，";
							proOffice.innerText = $info.professor.office + "，";
							proOrg.innerText = $info.professor.orgName + " | ";
							proAddress.innerText = $info.professor.address;
						} else if(!$info.professor.title && $info.professor.office && $info.professor.orgName && $info.professor.address) {
							proOffice.innerText = $info.professor.office + "，";
							proOrg.innerText = $info.professor.orgName + " | ";
							proAddress.innerText = $info.professor.address;
						} else if($info.professor.title && !$info.professor.office && $info.professor.orgName && $info.professor.address) {
							proTitle.innerText = $info.professor.title + "，";
							proOrg.innerText = $info.professor.orgName + " | ";
							proAddress.innerText = $info.professor.address;
						} else if($info.professor.title && $info.professor.office && !$info.professor.orgName && $info.professor.address) {
							proTitle.innerText = $info.professor.title + "，";
							proOffice.innerText = $info.professor.office + " | ";
							proAddress.innerText = $info.professor.address;
						} else if($info.professor.title && $info.professor.office && $info.professor.orgName && !$info.professor.address) {
							proTitle.innerText = $info.professor.title + "，";
							proOffice.innerText = $info.professor.office + "，";
							proOrg.innerText = $info.professor.orgName;
						} else if(!$info.professor.title && !$info.professor.office && $info.professor.orgName && $info.professor.address) {
							proOrg.innerText = $info.professor.orgName + " | ";
							proAddress.innerText = $info.professor.address;
						} else if(!$info.professor.title && $info.professor.office && !$info.professor.orgName && $info.professor.address) {
							proOffice.innerText = $info.professor.office + " | ";
							proAddress.innerText = $info.professor.address;
						} else if(!$info.professor.title && $info.professor.office && $info.professor.orgName && !$info.professor.address) {
							proOffice.innerText = $info.professor.office + "，";
							proOrg.innerText = $info.professor.orgName;
						} else if($info.professor.title && !$info.professor.office && !$info.professor.orgName && $info.professor.address) {
							proTitle.innerText = $info.professor.title + " | ";
							proAddress.innerText = $info.professor.address;
						} else if($info.professor.title && !$info.professor.office && $info.professor.orgName && !$info.professor.address) {
							proOffice.innerText = $info.professor.title + "，";
							proAddress.innerText = $info.professor.orgName;
						} else if($info.professor.title && $info.professor.office && !$info.professor.orgName && !$info.professor.address) {
							proTitle.innerText = $info.professor.title + "，";
							proOffice.innerText = $info.professor.office;
						} else if(!$info.professor.title && !$info.professor.office && !$info.professor.orgName && $info.professor.address) {
							proAddress.innerText = $info.professor.address;
						} else if(!$info.professor.title && !$info.professor.office && $info.professor.orgName && !$info.professor.address) {
							proOrg.innerText = $info.professor.orgName;
						} else if(!$info.professor.title && $info.professor.office && !$info.professor.orgName && !$info.professor.address) {
							proOffice.innerText = $info.professor.office;
						} else if($info.professor.title && !$info.professor.office && !$info.professor.orgName && !$info.professor.address) {
							proTitle.innerText = $info.professor.title;
						}
						if($info.professor.hasHeadImage) {
							document.getElementById('proHead').src = baseUrl + "/images/head/" + $info.professor.id + "_l.jpg";
						}
						plus.nativeUI.closeWaiting();
						ws.show("slide-in-right", 150);
					}

				}
			});
		}
		demandAngle();
		document.getElementById("repaly").addEventListener("tap", function() {
				mui.ajax(baseUrl + '/ajax/consult/byDemand', {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					timeout: 10000, //超时设置
					data: {
						"demandId": ws.deman,
						"professorId": userid
					},
					success: function(data) {
						if(data.success) {
							console.log(JSON.stringify(data));
							data3=data.data
							if(data == null) {
									 newConsuit();
							} else {
								webviewShow = plus.webview.create("../html/chats.html", 'chats.html', {}, {
									'consultId': data.data,
									'consultantId': conId
								});
							}
						}
					}
				})
			})
			/*创建新咨询*/
		function newConsuit() {
			mui.ajax(baseUrl + '/ajax/consult', {
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				data: {
					consultType: denmandTitle,
					consultTitle: demandContent,
					consultContant: demandType,
					professorId: userid,
					consultantId: conId,
					demandId: ws.deman
				},
				success: function(data) {
					webviewShow = plus.webview.create("../html/chats.html", 'chats.html', {}, {
						'consultId': data3,
						'consultantId': conId
					});
				}
			})
		}

	})
})