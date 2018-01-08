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
function pulldownRefresh() {
	setTimeout(function() {
//		demandOnePase();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1500);
}
function pullupRefresh() {
	setTimeout(function() {
//		Num = ++Num;
//		myDemandList(10,Num);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh();
	}, 1500);

}



var ocollectBtn = document.getElementsByClassName("collectBtn")[0],
    oanswer = document.getElementsByClassName("go-answer")[0],
    yaoanswer = document.getElementsByClassName("invite-answer")[0];
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var questionId=self.quid;
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().show("slide-in-right", 150);
	getConmain();
	console.log(JSON.stringify(questionId))

	//关注按钮
//	var oifCollect=document.getElementById("ifCollect")
//	ifcollectionAbout(questionId,oifCollect, 5);
//	ocollectBtn.addEventListener('tap', function() {
//		if(userid && userid != null && userid != "null") {
//			if(oifCollect.className == 'mui-icon iconfontnew icon-yishoucang') {
//				cancelCollectionAbout(questionId,oifCollect, 5)
//			} else {
//				collectionAbout(questionId,oifCollect, 5);
//			}
//		} else {
//			isLogin();
//		}
//	});
	
	oanswer.addEventListener('tap', function() {
		var id =document.getElementById("questionId").getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/qa-answer-q.html", 'qa-answer-q.html', {}, {
			"quid": id
		});
	})
	yaoanswer.addEventListener('tap', function() {
		var id =document.getElementById("questionId").getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/qa-request-da.html", 'qa-request-da.html', {}, {
			"quid": id
		});
	})

	function getConmain() {
		mui.ajax(baseUrl + '/ajax/question/qo', {
			data: {
				"id": questionId
			},
			dataType: 'json',
			type: 'get', 
			success: function(data) {
				if(data.success) {
					console.log(JSON.stringify(data))
					conHtml(data.data);
				}
			}
		});
	}
	function conHtml($da) {
		document.getElementById("questionId").setAttribute("data-id",$da.id);
		document.getElementById("questionTit").innerHTML = $da.title;
		document.getElementById("questionCnt").innerHTML = $da.cnt;
		document.getElementById("questionTime").innerHTML = commenTime($da.createTime);
		document.getElementById("replyCount").innerHTML = $da.replyCount;
		
		if($da.keys != undefined && $da.keys.length != 0) {
			var subs = new Array();
			if($da.keys.indexOf(',')) {
				subs = $da.keys.split(',');
			} else {
				subs[0] = $da.keys;
			}
			var pstr = ""
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					pstr += '<li><span class="h2Font">' + subs[i] + '</span></li>'
				};
				document.getElementsByClassName("tagList")[0].innerHTML = pstr;
			} else {
				document.getElementsByClassName("tagList")[0].style.display = "none";
			}
		}
	}
	function answerList(byway){
		if(byway==1){
			typeurl="/ajax/question/answer/qes/byScore"
		}else if(byway==2){
			typeurl="/ajax/question/answer/qes/byTime"
		}
		mui.ajax(baseUrl + typeurl, {
			data: {
				"qid": questionId,
				"time": time,
				"id":id,
				"rows":rows
			},
			dataType: 'json',
			type: 'get', 
			success: function(data) {
				if(data.success) {
					console.log(JSON.stringify(data))
					for(var i = 0; i < data.data.length; i++) {
						var dataStr = data.data[i]
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", dataStr.id);
						document.getElementById(aimId).appendChild(liStr);
						answerHtml(dataStr,liStr);
					}
				}
			}
		});
	}
	function answerHtml(dataStr,liStr) {
		document.getElementById("questionId").setAttribute("data-id",$da.id);
		document.getElementById("questionTit").innerHTML = $da.title;
		document.getElementById("questionCnt").innerHTML = $da.cnt;
		document.getElementById("questionTime").innerHTML = commenTime($da.createTime);
		document.getElementById("replyCount").innerHTML = $da.replyCount;
		
		if($da.keys != undefined && $da.keys.length != 0) {
			var subs = new Array();
			if($da.keys.indexOf(',')) {
				subs = $da.keys.split(',');
			} else {
				subs[0] = $da.keys;
			}
			var pstr = ""
			if(subs.length > 0) {
				for(var i = 0; i < subs.length; i++) {
					pstr += '<li><span class="h2Font">' + subs[i] + '</span></li>'
				};
				document.getElementsByClassName("tagList")[0].innerHTML = pstr;
			} else {
				document.getElementsByClassName("tagList")[0].style.display = "none";
			}
		}
	}
	

	/*微信及微信朋友圈分享专家*/
//	var auths, shares;
//	plus.oauth.getServices(function(services) {
//		auths = {};
//		for(var i in services) {
//			var t = services[i];
//			auths[t.id] = t;
//
//		}
//	}, function(e) {
//		alert("获取登录服务列表失败：" + e.message + " - " + e.code);
//	});
//	plus.share.getServices(function(services) {
//
//		shares = {};
//		for(var i in services) {
//
//			var t = services[i];
//
//			shares[t.id] = t;
//
//		}
//	}, function(e) {
//		alert("获取分享服务列表失败：" + e.message + " - " + e.code);
//	});
//	mui("#shareBlock").on("tap", "li", function() {
//		document.getElementById("shareBlock").style.display = "none";
//		document.getElementById("maskBlack").style.display = "none";
//		var oFen = this.getElementsByTagName("span")[0].innerHTML;
//
//		var oUrl = baseUrl + "/images/logo180.png";
//
//		if(oFen == "微信好友") {
//			if(!weixinClient()) {
//					return;
//				}
//			var share = buildShareService("weixin");
//			if(share) {
//				shareMessage(share, "WXSceneSession", {
//					content: document.getElementById("paperAbstract").innerHTML.substring(0, 70),
//					title: document.getElementById("paperName").innerHTML,
//					href: baseUrl + "/e/l.html?id=" + paperId,
//					thumbs: [oUrl]
//				});
//			}
//		} else if(oFen == "微信朋友圈") {
//			if(!weixinClient()) {
//					return;
//				}
//			var share = buildShareService("weixin");
//			if(share) {
//				shareMessage(share, "WXSceneTimeline", {
//					content: document.getElementById("paperAbstract").innerHTML.substring(0, 70),
//					title: document.getElementById("paperName").innerHTML,
//					href: baseUrl + "/e/l.html?id=" + paperId,
//					thumbs: [oUrl]
//				});
//			}
//		} else if(oFen == "新浪微博") {
//			var share = buildShareService("sinaweibo");
//			if(share) {
//				shareMessage(share, "sinaweibo", {
//					content: document.getElementById("paperName").innerHTML + baseUrl + "/e/l.html?id=" + paperId,
//				});
//			}
//		}
//
//	})
//
//	function buildShareService(ttt) {
//		var share = shares[ttt];
//		if(share) {
//			if(share.authenticated) {
//				console.log("---已授权---");
//			} else {
//				console.log("---未授权---");
//				share.authorize(function() {
//					console.log('授权成功...')
//				}, function(e) {
//					//alert("认证授权失败：" + e.code + " - " + e.message);
//					return null;
//				});
//			}
//			return share;
//		} else {
//			alert("没有获取微信分享服务");
//			return null;
//		}
//
//	}
//
//	function shareMessage(share, ex, msg) {
//		msg.extra = {
//			scene: ex
//		};
//		share.send(msg, function() {
//			plus.nativeUI.closeWaiting();
//			if(plus.storage.getItem('userid')) {
//				//shareAddIntegral(2);
//				if(msg.content=="赶快认领，上千家企业正在期待与您合作") {
//					shareAddIntegral(1);
//				}else{
//					shareAddIntegral(6);
//				}
//			}
//		}, function(e) {
//			plus.nativeUI.closeWaiting();
//			if(e.code == -2) {
//				
//			}
//		});
//	}
//

//	moreMes();
	function moreMes() {
		document.getElementById("BtnMore").addEventListener("tap", function() {
			var oUrl = baseUrl + "/images/logo180.png";
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
				proid: paperId,
				name: "paper",
				data: {
					content: document.getElementById("paperAbstract").innerHTML.substring(0, 40),
					title: document.getElementById("paperName").innerHTML,
					href: baseUrl + "/e/l.html?id=" + paperId,
					thumbs: [oUrl]
				},
				weiboData: {
					content: document.getElementById("paperName").innerHTML + baseUrl + "/e/l.html?id=" + paperId,
				}
			})
		})
	}

});
