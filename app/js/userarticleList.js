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
		++Num;
		getArticel(10,Num);
	}, 1000);

}

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	proId = self.proid;
	mui("#articelShow").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		var ownerid = this.getAttribute("owner-id");
		console.log(id);
		console.log(ownerid)
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
			articleId: id,
			ownerid: ownerid,
		});
	})
	getArticel(10,1);
})

function getArticel(pageSize,pageNo) {
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/article/pqProPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"professorId": proId,
				"pageSize": pageSize,
				"pageNo": pageNo
			},
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				console.log(JSON.stringify(data))
				if(data.success) {
					if(pageNo!=data.data.pageNo) {
						data.data.data=[];
					}
					var obj = data.data.data;
					if(obj.length > 0) {
						for(var i = 0; i < obj.length; i++) {
							var liItem = document.createElement("li");
							liItem.setAttribute("data-id", obj[i].articleId);
							liItem.setAttribute("owner-id", obj[i].professorId);
							liItem.className = "mui-table-view-cell"
							var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
							if(obj[i].articleImg) {
								oString += '<div class="madiaHead artHead" style="background-image:url(' + baseUrl + '/data/article/' + obj[i].articleImg + ')"></div>'
							} else {
								oString += '<div class="madiaHead artHead"></div>'
							}
							oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis-2 h1Font">' + obj[i].articleTitle + '</p>'
							oString += '</div></div>'
							liItem.innerHTML = oString;
							document.getElementById("articelShow").appendChild(liItem);
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


