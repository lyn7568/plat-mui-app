mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var proId = self.proid;
	console.log(proId)
	getResource()

	function getResource() {
		mui.ajax(baseUrl + "/ajax/resource/pqProPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"professorId": proId,
				"pageSize": 100
			},
			success: function(data) {
				console.log(JSON.stringify(data))
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						
						for(var i = 0; i < obj.length; i++) {
							var liItem = document.createElement("li");
							liItem.className = "mui-table-view-cell"
							liItem.setAttribute("data-id", obj[i].resourceId)
							var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
							if(obj[i].images.length) {
								oString += '<div class="madiaHead resouseHead" style="background-image:url(' + baseUrl + '/data/resource/' + obj[i].images[0].imageSrc + ')"></div>'
							} else {
								oString += '<div class="madiaHead resouseHead"></div>'
							}
							oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis">用途：' + obj[i].supportedServices + '</p>'
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
	mui("#resourceShow").on("tap", "li", function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	})
})