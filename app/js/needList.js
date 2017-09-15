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
			myDemandList(10,Num);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((Num>2));
		}, 1500);
	
	}
	function pulldownRefresh() {
		setTimeout(function() {
			myDemandList(10,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}, 1500);
	}
	
	mui.plusReady(function() {
		mui("#myneedList").on("tap", "li>.madiaInfo", function() {
			var oDemandId = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
				demanid: oDemandId
			});
		})
	})
	function myDemandList(pageSize, pageNo) {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/demand/pq', {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"uid": plus.storage.getItem('userid'),
					"pageNo": pageNo,
					"pageSize": pageSize
				},
				success: function(data) {
					if(data.success) {
						var ws=plus.webview.getWebviewById("../html/needList.html");
						plus.nativeUI.closeWaiting();
						ws.show("slide-in-right", 150);
						if(pageNo == 1){
							document.getElementById("myneedList").innerHTML="";
						}
						if(pageNo!=data.data.pageNo) {
							data.data.data=[];
						}
						var $info = data.data.data;
						console.log(JSON.stringify(data))
						if($info.length > 0){
							for(var i = 0; i < $info.length; i++) {
								var liStr=document.createElement("li");
								liStr.className="mui-table-view-cell flexCenter";
								document.getElementById("myneedList").appendChild(liStr);
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
			});
		})
	}
	function demandHtml($data,liStr) {
		var statusU="";
		var dateGap = delayDay($data.invalidDay);
		if($data.state==1 && dateGap=="1"){
			statusU='<span class="draftLable">即将于 '+TimeTr($data.invalidDay)+' 过期</span>'
		}
		if($data.state==0){
			statusU='<span class="draftLable">已于 '+TimeTr($data.invalidDay)+' 过期</span>'
		}else if($data.state==2){
			statusU='<span class="overLable">已于 '+TimeTr($data.modifyTime)+' 完成</span>'
		}else if($data.state==3){
			statusU='<span>已于 '+TimeTr($data.modifyTime)+' 关闭</span>'
		}
		var strCon='';
			strCon+='<div class="madiaInfo" data-id="'+$data.id+'">'
			strCon+='<p class="h1Font mui-ellipsis-2">'+ $data.title +'</p>'
			strCon+='<div class="showli mui-ellipsis">'
			strCon+='<span>发布于 '+TimeTr($data.createTime)+'</span>'
			strCon+= statusU
			strCon+='</div>'
		liStr.innerHTML=strCon;
	}
	function delayDay(startTime){
		var dateToday = new Date();
		var dateInvalid = new Date();
		dateInvalid.setFullYear(parseInt(startTime.substring(0, 4)));
		dateInvalid.setMonth(parseInt(startTime.substring(4, 6)) - 1);
		dateInvalid.setDate(parseInt(startTime.substring(6, 8)));
		
		var dateGap = Math.abs(dateToday.getTime() - dateInvalid.getTime());
		var ifDelay="0";
		if(dateGap < 604800000){
			ifDelay="1";
		}
		return ifDelay;
	}

		/*查询单个需求*/
//		mui('.tableList').on('tap', 'li', function(e) {
//			var oDemandId = this.getAttribute('demandId');
//			var demandStatus = this.getAttribute('demandStatus');
//			mui.openWindow({
//				url: '../html/needShow.html',
//				id: '../html/needShow.html',
//				show: {
//					autoShow: false,
//					aniShow: "slide-in-right"
//				},
//				extras: {
//					demanid: oDemandId,
//					demandStatus1: demandStatus
//				}
//
//			});
//		});
		/*发布新需求*/
//		document.getElementById("btnLinkBox").addEventListener("tap", function() {
//			mui.ajax(baseUrl + "/ajax/professor/auth", {
//		dataType: 'json', //数据格式类型
//		type: 'GET', //http请求类型
//		timeout: 10000, //超时设置
//		data: {
//			"id": userid
//		},
//		success: function(data) {
//			if(data.success) {
//				var $data = data.data;
//				if($data.authStatus == 3) {
//					var oDa = {};
//					oDa.flag = ($data.orgAuth == 0) ? 1 : 0;
//					mui.openWindow({
//						url: '../html/needIssue.html',
//						id: '../html/needIssue.html',
//						show: {
//							autoShow: false,
//							aniShow: "slide-in-right",
//						},
//						extras: oDa
//					});
//				} else {
//					if($data.orgAuth == 1) {
//						mui.openWindow({
//							url: '../html/needIssue.html',
//							id: '../html/needIssue.html',
//							show: {
//								autoShow: false,
//								aniShow: "slide-in-right",
//							}
//						});
//					} else {
//						if($data.authStatus == 2) {
//							plus.nativeUI.toast("我们正在对您的信息进行认证，请稍等片刻", {
//								'verticalAlign': 'center'
//							});
//						} else if($data.authStatus == 1) {
//							plus.nativeUI.toast("我们将尽快对您的信息进行认证", {
//								'verticalAlign': 'center'
//							});
//						} else if($data.authStatus <= 0) {
//							mui.openWindow({
//								url: '../html/realname-authentication.html',
//								id: 'realname-authentication.html',
//								show: {
//									autoShow: false,
//									aniShow: "slide-in-right",
//								}
//							});
//						}
//					}
//				}
//			}
//		},
//		error: function() {
//			plus.nativeUI.toast("服务器链接超时", toastStyle);
//			return;
//		}
//	});
//		})
//
//	});
//})