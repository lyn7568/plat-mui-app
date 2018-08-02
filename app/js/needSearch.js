mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			height: 50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		},
		down: {
			auto:true,
			callback: pulldownRefresh
		}
	}
});
var Num=1;
function pullupRefresh() {
	setTimeout(function() {
		Num = ++Num;
		demandList(5,Num);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh();
	}, 1500);

}
function pulldownRefresh() {
	setTimeout(function() {
		demandOnePase();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1500);
}
mui.plusReady(function() {
	mui("#demandList").on("tap", "li", function() {
		var oDemandId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
			demanid: oDemandId
		});
	})
})


/*需求列表*/
function demandList(pageSize, pageNo) {
	mui.plusReady(function() {
		mui.ajax(baseUrl+"/ajax/demand/search",{
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional:true,
			data: {
				"state":[1],
				"pageNo": pageNo,
				"pageSize":pageSize
			},
			success: function(data) {
				if(data.success) {
					var ws=plus.webview.getWebviewById("../html/needSearch.html");
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					if(pageNo==1) {
						document.getElementById("demandList").innerHTML="";
					}
					if(pageNo!=data.data.pageNo) {
						data.data.data=[];
					}
					var $info = data.data.data;
					console.log(JSON.stringify(data))
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=document.createElement("li");
							liStr.className="mui-table-view-cell";
							liStr.setAttribute( "data-id",$info[i].id);
							liStr.setAttribute( "data-creator",$info[i].creator);
							document.getElementById("demandList").appendChild(liStr);
							demandHtml($info[i],liStr);
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
function demandOnePase() {
	mui.plusReady(function() {
		Num=1;
		mui.ajax(baseUrl+"/ajax/demand/search",{
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional:true,
			data: {
				"state":"1",
				"pageNo": 1,
				"pageSize":5
			},
			success: function(data) {
				if(data.success) {
					mui('#pullrefresh').pullRefresh().refresh(true);
					var ws=plus.webview.getWebviewById("../html/needSearch.html");
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					document.getElementById("demandList").innerHTML="";
					var $info = data.data.data;
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=document.createElement("li");
							liStr.className="mui-table-view-cell";
							liStr.setAttribute( "data-id",$info[i].id);
							liStr.setAttribute( "data-creator",$info[i].creator);
							document.getElementById("demandList").appendChild(liStr);
							demandHtml($info[i],liStr);
						}
					}
					if(1 < Math.ceil(data.data.total / data.data.pageSize)) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	})
}
function demandHtml($data,liStr) {
	var strCon='';
		strCon+='<div class="madiaInfo">'
		strCon+='<p class="h1Font mui-ellipsis-2">'+ $data.title +'</p>'
		strCon+='<p class="h2Font mui-ellipsis-5">'+ $data.descp +'</p>'
		strCon+='<div class="showli mui-ellipsis">'
		
		if($data.city){ strCon+='<span>'+$data.city+'</span>' }
		if($data.duration!=0){ strCon+='<span>预期 '+demandDuration[$data.duration]+'</span>' }
		if($data.cost!=0){ strCon+='<span>预算 '+demandCost[$data.cost]+'</span>' }
		if($data.invalidDay){ strCon+='<span>有效期至 '+TimeTr($data.invalidDay)+'</span>' }
		
		strCon+='</div></div>'
	liStr.innerHTML=strCon;
}


