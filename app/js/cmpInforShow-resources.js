
mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		companyMessage(orgId);

		getResource()
		
		mui('#resourceShow').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
				resourceId: id
			});
		})
		
		
		
		function companyMessage(id) {
			mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data));
						var web = plus.webview.currentWebview()
						plus.nativeUI.closeWaiting();
						web.show("slide-in-right", 150);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		
		//获取资源
		function getResource() {
			mui.ajax(baseUrl + "/ajax/resource/pqOrgPublish", {
				type: "GET",
				timeout: 10000,
				dataType: "json",
				data: {
					"orgId": orgId,
					"pageNo": 1,
					"pageSize": 10,
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							for(var i = 0; i < obj.length; i++) {
								var liItem = document.createElement("li");
								liItem.setAttribute("data-id",obj[i].resourceId);
								liItem.className = "mui-table-view-cell"
								var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
								if(obj[i].images.length) {
									oString += '<div class="madiaHead resouseHead" style="background-image:url(' + baseUrl + '/data/resource/' + obj[i].images[0].imageSrc +')"></div>'
								} else {
									oString += '<div class="madiaHead resouseHead"></div>'
								}
								oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis">应用用途：' + obj[i].supportedServices + '</p>'
								oString += '</div></div>'
								liItem.innerHTML = oString;
								document.getElementById("resourceShow").appendChild(liItem);
							}
							
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
		document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
			if(web) 
				mui.fire(web, "newId",{
									rd: 1
							});
	})
	});
})