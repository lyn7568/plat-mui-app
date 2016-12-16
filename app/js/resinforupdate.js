mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		document.getElementById("userimg").setAttribute("resouFlag", self.reFlag);
		console.log(document.getElementById("userimg").getAttribute("resouFlag"))
		var resourceId = self.resourceId;
		window.addEventListener("resourceMess", function(event) {
				resourceMess();
			})
			//查询学术领域
		var subjectShow = function(data) {
				if(data != undefined && data.length != 0) {
					var subs = new Array();
					if(data.indexOf(',')) {
						subs = data.split(',');
					} else {
						subs[0] = data;
					}
					if(subs.length > 0) {
						var html = [];
						for(var i = 0; i < subs.length; i++) {
							html.push("<li>" + subs[i] + "</li>");
						};
						document.getElementsByClassName("infosubject")[0].innerHTML = html.join('');
					}
				}
			}
			//查询应用行业
		var industryShow = function(data) {
			if(data != undefined && data.length != 0) {
				var subs = new Array();
				if(data.indexOf(',')) {
					subs = data.split(',');
				} else {
					subs[0] = data;
				}
				if(subs.length > 0) {
					var html = [];
					for(var i = 0; i < subs.length; i++) {
						html.push("<li>" + subs[i] + "</li>");
					};
					document.getElementsByClassName("infoapply")[0].innerHTML = html.join('');
				}
			}
		}
		var resourceMess = function() {

			mui.ajax(baseUrl + "/ajax/resource/" + resourceId, {
				"type": "get",
				"async": true,
				"success": function(data) {
					var y = JSON.stringify(data);
					console.log(y);
					if(data.success) {
						var $data = data.data;
						plus.nativeUI.closeWaiting();
						self.show("slide-in-right", 150);
						//资源基本信息
						if($data.images.length) {
							document.getElementById("userimg").src = baseUrl + '/images/resource/' + $data.resourceId + '.jpg';
						}
						var oRes = document.getElementsByClassName("listtit2");
						oRes[0].innerText = $data.resourceName;
						oRes[1].innerText = $data.supportedServices;
						if($data.subject) {
							subjectShow($data.subject);
						} else {
							document.getElementById("subModify").innerText = "点击添加"
						}
						//应用行业
						if($data.industry) {
							industryShow($data.industry);
						} else {
							document.getElementById("indModify").innerText = "点击添加"
						}
						//详细介绍
						if($data.descp) {
							document.getElementById("descp1").innerText = $data.descp;
						} else {
							document.getElementById("desModify").innerText = "点击添加"
						}
						//合作备注
						if($data.cooperationNotes) {
							document.getElementById("cooperationNotes").innerText = $data.cooperationNotes;
						}
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});

		}
		if(resourceId) {
			resourceMess();
		}
		document.getElementById("mess").addEventListener("click", function() {
			plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res01.html", "updateinfo-res01.html", {}, {
				rsId: resourceId,
				reFlag: self.reFlag
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});

		document.getElementById("subject").addEventListener("click", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res02.html", "updateinfo-res02.html", {}, {
				rsId: resourceId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		document.getElementById("industry").addEventListener("click", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res03.html", "updateinfo-res03.html", {}, {
				rsId: resourceId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		document.getElementById("descp").addEventListener("click", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res04.html", "updateinfo-res04.html", {}, {
				rsId: resourceId,
				reFlag: self.reFlag
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		document.getElementById("cooperation").addEventListener("click", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res05.html", "updateinfo-res05.html", {}, {
				rsId: resourceId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		//删除资源
		document.getElementsByClassName("exitbtn")[0].addEventListener("click", function() {
			$.ajax({
				"url": baseUrl + "/ajax/resource/" + resourceId,
				"type": "DELETE",
				"success": function($data) {
					if($data.success) {
						if(self.reFlag == 0) {
							var web = plus.webview.getWebviewById("html/proinforupdate.html");
							mui.fire(web, "newId");
							mui.back();
						} else if(self.reFlag == 1) {
							var web = plus.webview.getWebviewById("html/companyUpdata.html");
							mui.fire(web, "newId");
							mui.back();
						} else if(self.reFlag == 2) {
							var web = plus.webview.getWebviewById("html/studentUpdata.html");
							mui.fire(web, "newId");
							mui.back();
						}

					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		});
	});
});