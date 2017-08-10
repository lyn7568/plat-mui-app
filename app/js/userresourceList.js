var proId;
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
	var self = plus.webview.currentWebview();
	proId = self.proid;
	console.log(proId)
	mui("#resourceShow").on("tap", "li", function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	})
	getResource(10,1);
})

	

function getResource(pageSize,pageNo) {
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/resource/pqProPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"professorId": proId,
				"pageSize":pageSize,
				"pageNo":pageNo
			},
			success: function(data) {
				console.log(JSON.stringify(data))
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				if(data.success) {
					if(pageNo!=data.data.pageNo) {
						data.data.data=[];
					}
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
					if(pageNo < Math.ceil(data.data.total / data.data.pageSize)) {
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
	
