//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
var key1 = [],
	key2 = [1, 1, 1, 1, 1],
	ifkong=[1, 1, 1, 1, 1],
	rows=1,
	pageSize=2,
	pageNo=1;
	
mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var webview = plus.webview.currentWebview();
		var tabFlag = webview.qiFlag;
		var search = {
			oAjaxGet: function(url, obj, oType, oFun) {
				mui.plusReady(function() {
					mui.ajax(url, {
						data: obj,
						dataType: 'json', //服务器返回json格式数据
						type: oType, //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						traditional: true,
						async: false,
						success: function(res) {
							if(res.success) {
								console.log(JSON.stringify(res))
								oFun(res);
							}
						}
					});
				})

			},
			oMyQ: function(res) {
				var time = "",id = "",aimId="myQ",$_index=0;
				if(res.data.length>0){
					time = res.data[res.data.length-1].createTime;
					id = res.data[res.data.length-1].id;
					if(!ifkong[$_index]){
						search.removeAfter(aimId)
					}
					for(var i = 0; i < res.data.length; i++) {
						var dataStr = res.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						search.questionModule(dataStr, liStr);
					}
				}else{
					if(ifkong[$_index]){
						var newStr="您还没有提过问题";
						search.insertAfter(newStr,aimId);
						ifkong[$_index]=0
					}
					key1[$_index].endPullUpToRefresh(true);
					return;
				}
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == $_index) {
							key1[index] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == $_index) {
												search.oAjaxGet(baseUrl + "/ajax/question/my", {
													"uid": userid,
													"rows":rows,
													"time":time,
													"id":id
												}, "get", search.oMyQ, self);
											}
										}, 1000);
									}
								}
							});
						}
					});
					
					key1[$_index].endPullUpToRefresh(false);
					if(res.data.length==0){
						key2[$_index] = 0;
						key1[$_index].endPullUpToRefresh(true);
					}
				}
			},
			oMyA: function(res) {
				var time = "",id = "",aimId="myA",$_index=1;
				if(res.data.length>0){
					time = res.data[res.data.length-1].createTime;
					id = res.data[res.data.length-1].id;
					if(!ifkong[$_index]){
						search.removeAfter(aimId)
					}
					for(var i = 0; i < res.data.length; i++) {
						var dataStr = res.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						search.answerModule(dataStr, liStr);
					}
				}else{
					if(ifkong[$_index]){
						var newStr="您还没有回答问题";
						search.insertAfter(newStr,aimId);
						ifkong[$_index]=0
					}
					return;
				}
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == $_index) {
							key1[index] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == $_index) {
												search.oAjaxGet(baseUrl + "/ajax/question/answer/bySelf", {
													"uid": userid,
													"rows":rows,
													"time":time,
													"id":id
												}, "get", search.oMyA, self);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[$_index] = 0;
				}
			},
			oWatchPro:function(res){
				var aimId="watchPro",$_index=2;
				if(res.data.data.length>0){
					if(!ifkong[$_index]){
						search.removeAfter(aimId)
					}
					for(var i = 0; i < res.data.data.length; i++) {
						var dataStr = res.data.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						search.proModule(dataStr, liStr);
					}
				}else{
					if(ifkong[$_index]){
						var newStr="您还没有关注的人";
						search.insertAfter(newStr,aimId);
						ifkong[$_index]=0
					}
					key1[$_index].endPullUpToRefresh(true);
					return;
				}
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == $_index) {
							key1[index] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											alert(pageNo+"88888888888")
											if(index == $_index) {
												search.oAjaxGet(baseUrl + "/ajax/watch/qaPro", {
													"professorId": userid,
													"watchType":1,
													"pageSize":pageSize,
													"pageNo":++pageNo
												}, "get", search.oWatchPro,self);
											}
										}, 1000);
										
									}
								}
							});
						}
					});
					key2[$_index] = 0;
				}
				if(pageNo < Math.ceil(res.data.total / res.data.pageSize)) {
					key1[$_index].endPullUpToRefresh(false);
				} else {
					key1[$_index].endPullUpToRefresh(true);
				}
			},
			oWatchQ: function(res) {
				var time = "",id = "",aimId="watchQ",$_index=3;
				if(res.data.length>0){
					time = res.data[res.data.length-1].createTime;
					id = res.data[res.data.length-1].id;
					if(!ifkong[$_index]){
						search.removeAfter(aimId)
					}
					for(var i = 0; i < res.data.length; i++) {
						var dataStr = res.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						search.questionModule(dataStr, liStr)
					}
				}else{
					if(ifkong[$_index]){
						var newStr="您还没有关注的问题";
						search.insertAfter(newStr,aimId);
						ifkong[$_index]=0
					}
					return;
				}
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == $_index) {
							key1[index] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == $_index) {
												search.oAjaxGet(baseUrl + "/ajax/question/watch", {
													"uid": userid,
													"rows":rows,
													"time":time,
													"id":id
												}, "get", search.oWatchQ, self);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[$_index] = 0;
				}
			},
			oWatchA: function(res) {
				var time = "",id = "",aimId="watchA",$_index=4;
				if(res.data.length>0){
					time = res.data[res.data.length-1].createTime;
					id = res.data[res.data.length-1].id;
					if(!ifkong[$_index]){
						search.removeAfter(aimId)
					}
					for(var i = 0; i < res.data.length; i++) {
						var dataStr = res.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						search.answerModule(dataStr, liStr);
					}
				}else{
					if(ifkong[$_index]){
						var newStr="您还没有收藏的回答";
						search.insertAfter(newStr,aimId);
						ifkong[$_index]=0
					}
					return;
				}
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == $_index) {
							key1[index] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == $_index) {
												search.oAjaxGet(baseUrl + "/ajax/question/answer/byWatch", {
													"uid": userid,
													"rows":rows,
													"time":time,
													"id":id
												}, "get", search.oWatchA, self);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[$_index] = 0;
				}
			},
			proModule:function(dataStr, liStr){
				var dataStr=dataStr.professor
				var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
					var os = "";
					if(dataStr.title) {
						if(dataStr.orgName) {
							os = dataStr.title + "，" + dataStr.orgName;
						} else {
							os = dataStr.title;
						}
					} else {
						if(dataStr.office) {
							if(dataStr.orgName) {
								os = dataStr.office + "，" + dataStr.orgName;
							} else {
								os = dataStr.office;
							}
						} else {
							if(dataStr.orgName) {
								os = dataStr.orgName;
							}
						}
					}
					var baImg = "../images/default-photo.jpg";
					if(dataStr.hasHeadImage == 1) {
						baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
					}
					var oSub = "";
					if(dataStr.researchAreas.length) {
						var arr = [];
						for(var n = 0; n < dataStr.researchAreas.length; n++) {
							arr[n] = dataStr.researchAreas[n].caption;
						}
						oSub = "研究方向：" + arr.join("；");
					}
					liStr.setAttribute("data-id", dataStr.id);
					liStr.setAttribute("data-flag", 1);
					liStr.className = "mui-table-view-cell flexCenter";
					liStr.innerHTML = ' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
						'<div class="madiaInfo">' +
						'<p><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'<p class="mui-ellipsis h2Font">' + os + '</p>' +
						'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
						'</div>'
			},
			questionModule: function(dataStr, liStr) {
				var baImg = "../images/default-q&a.jpg";
				if(dataStr.img) {
					baImg = baseUrl + dataStr.img;
				}
				var hd = "";
				if(dataStr.replyCount > 0) {
					hd = '<span>' + dataStr.replyCount + ' 回答</span>'
				}
				liStr.className = "mui-table-view-cell";
				liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
					'<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="madiaInfo OmadiaInfo">' +
					'<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
					'<p class="show-item mui-ellipsis h2Font">' + hd + '<span>N 关注</span></p>' +
					'</div></div>'
			},
			answerModule: function(dataStr, liStr) {
				var baImg = "../images/default-photo.jpg";
				var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
				var os = "";
				if(dataStr.title) {
					if(dataStr.orgName) {
						os = dataStr.title + "，" + dataStr.orgName;
					} else {
						os = dataStr.title;
					}
				} else {
					if(dataStr.office) {
						if(dataStr.orgName) {
							os = dataStr.office + "，" + dataStr.orgName;
						} else {
							os = dataStr.office;
						}
					} else {
						if(dataStr.orgName) {
							os = dataStr.orgName;
						}
					}
				}
				var baImg = "../images/default-photo.jpg";
				if(dataStr.hasHeadImage == 1) {
					baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
				}
				var hd = "";
				if(dataStr.replyCount > 0) {
					hd = '<span>' + dataStr.replyCount + ' 回答</span>'
				}
				liStr.className = "mui-table-view-cell";
				liStr.innerHTML = '<div class="madiaInfo">'+
										'<p class="h1Font mui-ellipsis-2">'+dataStr.title+'</p>'+
										'<div class="flexCenter qa-owner">'+
											'<div class="owner-head useHead"></div>'+
											'<div class="owner-info">'+
												'<div class="owner-name"><span class="h1Font">张某某</span><em class="authicon authicon-pro" title="科袖认证专家"></em></div>'+
												'<div class="owner-tit mui-ellipsis h2Font">职称/职位,所在机构职称/职位,所在机构职称/职位,所在机构</div>'+
											'</div>'+
										'</div>'+
										'<p class="qa-con mui-ellipsis-5">'+dataStr.cnt+'</p>'+
										'<div class="showli mui-ellipsis">'+
											'<span>5月8日 18:00</span><span>N 赞</span><span>N 留言</span>'+
										'</div>'+
									'</div>'
									
			},
			insertAfter:function(newStr, targetE){
			    var parent = document.getElementById(targetE).parentNode;
			    var kong = document.createElement("div");
			   		kong.className="con-kong";
			   		kong.innerHTML=newStr;
			   	if(parent.lastChild.className == "con-kong"){
			        return
			   	}else{
			        parent.insertBefore( kong, document.getElementById(targetE).nextSibling );
			   	}
			    
			},
			removeAfter:function(targetE){
				var parent = document.getElementById(targetE).parentNode;
				if(parent.lastChild.className == "con-kong"){
			   		parent.removeChild(parent.querySelector(".con-kong"));
			   	}else{
			        return
			   	}
			},
			slideFun:function($type){
				if($type == "1") {
					document.getElementById("myQ").innerHTML="";
					search.oAjaxGet(baseUrl + "/ajax/question/my", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oMyQ);
				} else if($type == "2") {
					document.getElementById("myA").innerHTML="";
					search.oAjaxGet(baseUrl + "/ajax/question/answer/bySelf", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oMyA);
				} else if($type == "3") {
					document.getElementById("watchPro").innerHTML="";
					pageNo=1
					search.oAjaxGet(baseUrl + "/ajax/watch/qaPro", {
						"professorId": userid,
						"watchType":1,
						"pageSize":pageSize,
						"pageNo":pageNo
					}, "get", search.oWatchPro);
				} else if($type == "4") {
					document.getElementById("watchQ").innerHTML="";
					search.oAjaxGet(baseUrl + "/ajax/question/watch", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oWatchQ);
				} else if($type == "5") {
					document.getElementById("watchA").innerHTML="";
					search.oAjaxGet(baseUrl + "/ajax/question/answer/byWatch", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oWatchA);
				}
			},
		}
		
		search.oAjaxGet(baseUrl + "/ajax/question/my", {
			"uid": userid,
			"rows":rows,
		}, "get", search.oMyQ);
		
		//左滑及右滑
		document.querySelector('#slider').addEventListener('slide', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			var $type = $this.getAttribute("data-type")
			search.slideFun($type);
		});
		//点击
		document.querySelector('#slider').addEventListener('tap', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			var $type = $this.getAttribute("data-type")
			search.slideFun($type);
		});
		
		
		mui("#myQ,#watchQ").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				"id": id
			});
		})
		mui("#myA,#watchA").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
				"id": id
			});
		})
		mui("#watchPro").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				"proid": id
			});
		})
		
	})
});