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
	pageNo=1,
	rows=2,
	pageSize=2;
mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var search = {
			oAjaxGet: function(url, obj, oType, oFun) {
				var urlStr = baseUrl + url;
				mui.plusReady(function() {
					mui.ajax(urlStr, {
						data: obj,
						dataType: 'json',
						type: oType, 
						traditional: true,
						async: false,
						success: function(res) {
							if(res.success) {
								//console.log(JSON.stringify(res))
								oFun(res);
							}
						}
					});
				})
			},
			dataO:{time:"",id:"",type:"",url:""},
			listData: [{
					type:1,
					aimid:"myQ",
					url:"/ajax/question/my",
					notip:"您还没有提过问题",
				},
				{
					type:2,
					aimid:"myA",
					url:"/ajax/question/answer/bySelf",
					notip:"您还没有回答问题",
				},
				{
					type:3,
					aimid:"watchPro",
					url:"/ajax/watch/qaPro",
					notip:"您还没有关注的人",
				},
				{
					type:4,
					aimid:"watchQ",
					url:"/ajax/question/watch",
					notip:"您还没有关注的问题",
				},
				{
					type:5,
					aimid:"watchA",
					url:"/ajax/question/answer/byWatch",
					notip:"您还没有收藏的回答",
				},
			],
			comPull:function(dataStr,$_index,reStr){
				var that=search,
					aimId=that.listData[$_index].aimid,
					newStr=that.listData[$_index].notip;
					
				that.dataO.type=that.listData[$_index].type;
				that.dataO.url=that.listData[$_index].url;
				
				if(!ifkong[$_index]){that.removeAfter(aimId)}
				if(dataStr.length==0&&ifkong[$_index] && key2[$_index] ){
					that.insertAfter(newStr,aimId);
					ifkong[$_index]=0
				}
				
				if(key2[$_index]) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function($_index, pullRefreshEl) {
						key1[$_index] =mui(pullRefreshEl).pullToRefresh({
							up: {
								callback: function() {
									if(that.dataO.type==3){
										var self=this;
										setTimeout(function() {
											var rs={
												"professorId": userid,
												"watchType":1,
												"pageSize":pageSize,
												"pageNo":++pageNo
											};
											search.oAjaxGet(that.dataO.url, rs, "get",that.oWatchPro);
											self.endPullUpToRefresh()
										}, 1000);
									}else{
										var self=this;
										setTimeout(function() {
											var rs={
												"uid": userid,
												"rows":rows,
												"time":that.dataO.time,
												"id":that.dataO.id
											};
											if(that.dataO.type==1){
												search.oAjaxGet(that.dataO.url, rs, "get",that.oMyQ);
											}else if(that.dataO.type==2){
												search.oAjaxGet(that.dataO.url, rs, "get",that.oMyA);
											}else if(that.dataO.type==4){
												search.oAjaxGet(that.dataO.url, rs, "get",that.oWatchQ);
											}else if(that.dataO.type==5){
												search.oAjaxGet(that.dataO.url, rs, "get",that.oWatchA);
											}
											self.endPullUpToRefresh()
										}, 1000);
									}
								}
							}
						});
					});
					key1[$_index].endPullUpToRefresh(false);
					key2[$_index] = 0;
				}
				if(dataStr.length>0){
					that.dataO.time = dataStr[dataStr.length-1].createTime;
					that.dataO.id = dataStr[dataStr.length-1].id;
					
					for(var i = 0; i < dataStr.length; i++) {
						var liStr = document.createElement("li");
						document.getElementById(aimId).appendChild(liStr);
						if(that.dataO.type==1 || that.dataO.type==4){
							that.questionModule(dataStr[i], liStr);
						}else if(that.dataO.type==2 || that.dataO.type==5){
							that.answerModule(dataStr[i], liStr);
						}else if(that.dataO.type==3){
							that.proModule(dataStr[i], liStr);
						}
					}
					if(that.dataO.type==3){
						if(pageNo < Math.ceil(reStr.total / reStr.pageSize)) {
							key1[$_index].endPullUpToRefresh(false);
						} else {
							key1[$_index].endPullUpToRefresh(true);
						}
					}else{
						if(dataStr.length>rows){
							key1[$_index].endPullUpToRefresh(false);
						}
					}
				}else{
					key1[$_index].endPullUpToRefresh(true);
					return;
				}
				if(dataStr.length==0){
					key1[$_index].endPullUpToRefresh(true);
					return;
				}
				
			},
			oMyQ: function(res) {
				search.comPull(res.data,0);
			},
			oMyA: function(res) {
				search.comPull(res.data,1);
			},
			oWatchPro: function(res) {
				search.comPull(res.data.data,2,res.data);
			},
			oWatchQ: function(res) {
				search.comPull(res.data,3);
			},
			oWatchA: function(res) {
				search.comPull(res.data,4);
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
						'<p><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></p>' +
						'<p class="mui-ellipsis h2Font">' + os + '</p>' +
						'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
						'</div>'
			},
			questionModule: function(dataStr, liStr) {
				var baImg = "../images/default-q&a.jpg";
				var subs = new Array();
				if(dataStr.img) {
					if(dataStr.img.indexOf(',')) {
						subs = dataStr.img.split(',');
					} else {
						subs[0] = dataStr.img;
					}
					baImg = baseUrl + "/data/question"+ subs[0];
				}
				var hd = "";
				if(dataStr.replyCount > 0) {
					hd = '<span>' + dataStr.replyCount + ' 回答</span>'
				}
				liStr.setAttribute("data-id", dataStr.id);
				liStr.className = "mui-table-view-cell";
				liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
					'<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="madiaInfo OmadiaInfo">' +
					'<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
					'<p class="show-item mui-ellipsis h2Font">' + hd + '<span>N 关注</span></p>' +
					'</div></div>'
			},
			answerModule: function(dataStr, liStr) {
				var hd = "",hl="";
				if(dataStr.agree > 0) {
					hd = '<span>'+dataStr.agree+'赞</span>'
				}
				if(dataStr.ballot > 0){
					hl='<span>'+dataStr.ballot+'留言</span>'
				}
				liStr.setAttribute("data-id", dataStr.id);
				liStr.className = "mui-table-view-cell";
				var str = '<div class="madiaInfo">'+
								'<p class="h1Font mui-ellipsis-2 qa-question"></p>'+
								'<div class="flexCenter qa-owner"></div>'+
								'<p class="qa-con mui-ellipsis-5">'+dataStr.cnt+'</p>'+
								'<div class="showli mui-ellipsis">'+
									'<span>'+commenTime(dataStr.createTime)+'</span>'+ hd + hl+
								'</div>'+
							'</div>'
				var $str=$(str)
				$str.appendTo(liStr);
				search.questioninfo(dataStr.qid,$str);
				search.proinfo(dataStr.uid,$str);
				
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
				search.dataO={time:"",id:"",type:"",url:""},
				pageNo=1,
//				key1=[],
				key2 = [1, 1, 1, 1, 1];
//				if(key1[$type-1] instanceof Object){
//					key1[$type-1].endPullUpToRefresh(false);
//				}
				if($type == "1") {
					document.getElementById("myQ").innerHTML="";
					search.oAjaxGet("/ajax/question/my", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oMyQ);
				} else if($type == "2") {
					document.getElementById("myA").innerHTML="";
					search.oAjaxGet("/ajax/question/answer/bySelf", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oMyA);
				} else if($type == "3") {
					document.getElementById("watchPro").innerHTML="";
					search.oAjaxGet("/ajax/watch/qaPro", {
						"professorId": userid,
						"watchType":1,
						"pageSize":pageSize,
						"pageNo":pageNo
					}, "get", search.oWatchPro);
				} else if($type == "4") {
					document.getElementById("watchQ").innerHTML="";
					search.oAjaxGet("/ajax/question/watch", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oWatchQ);
				} else if($type == "5") {
					document.getElementById("watchA").innerHTML="";
					search.oAjaxGet("/ajax/question/answer/byWatch", {
						"uid": userid,
						"rows":rows,
					}, "get", search.oWatchA);
				}
			},
			allAgreeNum:function(){
				mui.ajax(baseUrl+"/ajax/question/answer/my/agree/count",{
					data: {"id":userid },
					dataType: 'json',
					type: "get",
					success: function(res) {
						if(res.success) {
							document.getElementById("allAgreeNum").innerHTML=res.data
						}
					}
				})
				
			},
			proinfo:function(pid,$str){
				search.oAjaxGet("/ajax/professor/baseInfo/"+pid, {}, "get", function(res){
					var dataStr=res.data
					var baImg = "../images/default-photo.jpg";
					if(dataStr.hasHeadImage == 1) {
						baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
					}
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
					var str='<div class="owner-head useHead" style="background-image:url('+baImg+')"></div>'+
							'<div class="owner-info">'+
								'<div class="owner-name"><span class="h1Font">'+dataStr.name+'</span><em class="authicon '+userType.sty+'" title="'+userType.title+'"></em></div>'+
								'<div class="owner-tit mui-ellipsis h2Font">'+os+'</div>'+
							'</div>'
					$str.find(".qa-owner").html(str)
				});
			},
			questioninfo:function(qid,$str){
				search.oAjaxGet("/ajax/question/qo", {
					"id": qid,
				}, "get", function(res){
					$str.find(".qa-question").html(res.data.title);
				});
				
			}
		}
		
		search.allAgreeNum();//总赞同数
		search.oAjaxGet("/ajax/question/my", {
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
			console.log(JSON.stringify(id))
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				"quid": id
			});
		})
		mui("#myA,#watchA").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
				"anid": id
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