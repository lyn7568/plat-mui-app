var orgId;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			height:50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
var Num=1;
function pullupRefresh() {
	setTimeout(function() {
		Num++;
		getResource(10,Num);
	}, 1000);

}

mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	orgId = self.cmpId;

	getResource(10,1);
	
	mui('#resourceShow').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: id
		});
	})
})		
//获取资源
function getResource(pageSize,pageNo) {
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/resource/pqOrgPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"orgId": orgId,
				"pageNo": pageNo,
				"pageSize": pageSize,
			},
			success: function(data) {
				console.log(JSON.stringify(data))
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
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
							oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis">用途：' + obj[i].supportedServices + '</p>'
							oString += '</div></div>'
							liItem.innerHTML = oString;
							document.getElementById("resourceShow").appendChild(liItem);
						}
						if(obj.length<pageSize){ 
							mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
						}
					}
					
					if(pageNo < Math.ceil(data.total / data.pageSize)) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		})
	})
}
document.getElementsByClassName("topback")[0].addEventListener("tap", function() {
	var web = plus.webview.getWebviewById("cmpInforShow.html");
	if(web)
		mui.fire(web, "newId", {
			rd: 1
		});
});
