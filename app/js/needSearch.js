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
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((Num>2));
	}, 1000);

}
function pulldownRefresh() {
	setTimeout(function() {
		demandList(5,1);
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1500);
}
mui.plusReady(function() {
	mui("#demandList").on("tap", "li>.madiaInfo", function() {
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
				"state":"1",
				"pageNo": pageNo,
				"pageSize":pageSize
			},
			success: function(data) {
				if(data.success) {
					var ws=plus.webview.getWebviewById("../html/needSearch.html");
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					if(pageNo==1){
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
function demandHtml($data,liStr) {
	var strCon='';
		strCon+='<div class="madiaInfo" data-id="'+$data.id+'">'
		strCon+='<p class="h1Font mui-ellipsis-2">'+ $data.title +'</p>'
		strCon+='<p class="h2Font mui-ellipsis-5">'+ $data.descp +'</p>'
		strCon+='<div class="showli mui-ellipsis">'
		
		if($data.city){ strCon+='<span>'+$data.city+'</span>' }
		if($data.duration!=0){ strCon+='<span>预期：'+demandDuration[$data.duration]+'</span>' }
		if($data.cost!=0){ strCon+='<span>预算：'+demandCost[$data.cost]+'</span>' }
		if($data.invalidDay){ strCon+='<span>有效期至：'+TimeTr($data.invalidDay)+'</span>' }
		
		strCon+='</div></div>'
	liStr.innerHTML=strCon;
}

//
//function datalistEach(datalist) {
//	mui.each(datalist, function(index, ite) {
//		item = ite.professor;
//		/*获取头像*/
//		if(item.hasHeadImage == 1) {
//			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
//		} else {
//			var img = "../images/default-photo.jpg";
//		}
//
//		var title = "";
//		var office = "";
//		var orgName = "";
//		var address = "";
//		if(item.title && item.office && item.orgName && item.address) {
//			title = item.title + "，";
//			office = item.office + "，";
//			orgName = item.orgName + " | ";
//			address = item.address;
//		} else if(!item.title && item.office && item.orgName && item.address) {
//			office = item.office + "，";
//			orgName = item.orgName + " | ";
//			address = item.address;
//		} else if(item.title && !item.office && item.orgName && item.address) {
//			title = item.title + "，";
//			orgName = item.orgName + " | ";
//			address = item.address;
//		} else if(item.title && item.office && !item.orgName && item.address) {
//			title = item.title + "，";
//			office = item.office + " | ";
//			address = item.address;
//		} else if(item.title && item.office && item.orgName && !item.address) {
//			title = item.title + "，";
//			office = item.office + "，";
//			orgName = item.orgName;
//		} else if(!item.title && !item.office && item.orgName && item.address) {
//			orgName = item.orgName + " | ";
//			address = item.address;
//		} else if(!item.title && item.office && !item.orgName && item.address) {
//			office = item.office + " | ";
//			address = item.address;
//		} else if(!item.title && item.office && item.orgName && !item.address) {
//			office = item.office + "，";
//			orgName = item.orgName;
//		} else if(item.title && !item.office && !item.orgName && item.address) {
//			title = item.title + " | ";
//			address = item.address;
//		} else if(item.title && !item.office && item.orgName && !item.address) {
//			office = item.title + "，";
//			address = item.orgName;
//		} else if(item.title && item.office && !item.orgName && !item.address) {
//			title = item.title + "，";
//			office = item.office;
//		} else if(!item.title && !item.office && !item.orgName && item.address) {
//			address = item.address;
//		} else if(!item.title && !item.office && item.orgName && !item.address) {
//			orgName = item.orgName;
//		} else if(!item.title && item.office && !item.orgName && !item.address) {
//			office = item.office;
//		} else if(item.title && !item.office && !item.orgName && !item.address) {
//			title = item.title;
//		}
//		var typeTname = '';
//		var oSty = autho(item.authType, item.orgAuth, item.authStatus);
//		typeTname='<em class="authicon ' + oSty.sty + '"></em>'
//		
//		var li = document.createElement('li');
//		li.className = 'mui-table-view-cell mui-media';
//		li.setAttribute("demandId", ite.demandId);
//		var oCreateTime = ite.createTime.substr(0, 4) + "-" + ite.createTime.substr(4, 2) + "-" + ite.createTime.substr(6, 2) + " " + ite.createTime.substr(8, 2) + ":" + ite.createTime.substr(10, 2);
//		var odemand, odemandAim;
//		(ite.demandType == 1) ? odemand = "个人": odemand = "企业";
//		(ite.demandAim == 1) ? odemandAim = "技术": (ite.demandAim == 2) ? odemandAim = "资源" : odemandAim = "其他";
//		var oString = '<div class="coutopicbox"><span class="coutheme mui-ellipsis mui-pull-left">' + ite.demandTitle + '</span>'
//		oString += '<div class="coustatus mui-pull-right">'
//		oString += '<span class="aimlabel">' + odemand + '</span>'
//		oString += '<span class="aimlabel">' + odemandAim + '</span></div></div>'
//		oString += '<a class="proinfor itemBtn">' <!-- displayNone-->
//		oString += '<img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '">'
//		oString += '<div class="mui-media-body">'
//		oString += '<p class="listtit">' + item.name + ' ' + typeTname + ''
//		oString += '<span class="thistime">' + oCreateTime + '</span></p>'
//		oString += '<p class="listtit2">'
//		oString += '<span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>'
//		oString += '<p class="listtit3 mui-ellipsis">' + ite.demandContent + '</p></div></a>'
//		li.innerHTML = oString;
//		document.getElementsByClassName("tableList")[0].appendChild(li);
//
//	});
//}

