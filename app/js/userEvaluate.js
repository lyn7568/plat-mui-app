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
		historyEvaluate(5,Num);
	}, 1000);

}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	proId = self.proid;
	mui("#evaluateShow").on("tap", ".urlhref", function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			"proid": id,
		});
	})
	historyEvaluate(5,1);
})

function historyEvaluate(pageSize,pageNo){
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/consult/pqAssessHis", {
			"type": "get",
			"data": {
				"professorId": proId,
				"pageSize": pageSize,
				"pageNo": pageNo
			},
			traditional: true,
			"timeout": 10000,
			"success": function(response) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				if(response.success) {
					console.log(JSON.stringify(response))
					var $data = response.data.data;
					if($data.length>0){
						for(var i = 0; i < $data.length; i++) {
							var add = document.createElement("li");
							var assessTime = commenTime($data[i].assessTime);
							var assessContant ="";
							if($data[i].assessContant) {
								assessContant = $data[i].assessContant;
							}
							var userhed='';
							if($data[i].professor.hasHeadImage) {
								userhed = 'background-image:url('+baseUrl+'/images/head/' + $data[i].professor.id + '_l.jpg)';
							} else {
								userhed = 'background-image:url(../images/default-photo.jpg)';
							}

							add.className = "mui-table-view-cell flexCenter levelbox";
							
							add.innerHTML='<div class="madiaHead useHead useHeadMsg urlhref" style="'+ userhed +'" data-id='+$data[i].professor.id+'></div>'+
							       '<div class="madiaInfo"><div class="mui-clearfix" style="position:relative">'+			
							       '<span class="h1Font urlhref" data-id='+$data[i].professor.id+'>'+ $data[i].professor.name +'</span>'+
							       '<em class="authicon authicon-pro"></em>'+			
							       '<ul class="starShow">'+					
								       '<li class="mui-icon iconfont icon-favor"></li>'+ 
								       '<li class="mui-icon iconfont icon-favor"></li>'+
								       '<li class="mui-icon iconfont icon-favor"></li>'+
								       '<li class="mui-icon iconfont icon-favor"></li>'+
								       '<li class="mui-icon iconfont icon-favor"></li>'+
							       '</ul></div>'+		
							       '<p class="h2Font messageContent">'+ assessContant +'</p>'+
							       '<span class="commenttime">'+ assessTime +'</span>'+
							       '</div>';
							document.getElementById("evaluateShow").appendChild(add);
							var startLeval = parseInt($data[i].assessStar);
							var start = add.querySelectorAll(".iconfont");
							console.log(JSON.stringify(startLeval))
							console.log(JSON.stringify(start))
							for(var j = 0; j < startLeval; j++) {
								start[j].classList.remove("icon-favor");
								start[j].classList.add("icon-favorfill");
							}
						}
					}
					if(pageNo < Math.ceil(response.data.total / response.data.pageSize)) {
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