mui.plusReady(function() {

	var self = plus.webview.currentWebview();
	var proId = self.proid;
	mui("#patent").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/patentShow.html", 'patentShow.html', {}, {
			"patentId": id
		});
	})
	getPatent(self.authName)
	/*论文html*/
	function getPatent(oName) {
		mui.ajax(baseUrl + "/ajax/ppatent/byAuthor", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": proId,
				"author": oName,
				"pageSize":100
			},
			success: function(data) {
				console.log(JSON.stringify(data));
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						document.getElementById("patentNum").innerText = obj.length;
						if(obj.length > 2) {
							obj.length = 2;
							document.getElementById("seeMorePatent").classList.remove("displayNone");
						}
						alert(1)
						for(var i = 0; i < obj.length; i++) {
							var li = document.createElement("li");
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead patentHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("patent").appendChild(li);
						}
					} else {
						document.getElementById("patent").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	}
})