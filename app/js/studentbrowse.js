var ozixun = document.getElementById("zixun");
var yesExpert = document.getElementById("yesExpert");
var noExpert = document.getElementById("noExpert");
var personalMaterial = document.getElementsByClassName('personalMaterial');
var personSummary = document.getElementsByClassName("breifinfo")[0];
var professorName;
var resear = "";
var title="";
var orgAuth,orgId;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.proid;
	document.getElementsByClassName('footbox')[0].style.display = "none";
	if(userid == proId) {
		document.getElementsByClassName('footbox')[0].style.display = "none";
	}
	console.log(userid);
	/*点击咨询*/
	if(userid) {
		ozixun.addEventListener('tap', function() {
			var flag = 'professor';
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
				'proId': proId,
				'flag': flag
			});

			webviewShow.addEventListener("loaded", function() {

			}, false);
		});
	} else if(userid == '' || userid == undefined) {
		ozixun.addEventListener('tap', function() {
			/*mui.alert('请登录', '' ,function(){
				mui.openWindow({
					url: '../html/login.html',
					id: 'html/login.html',
					show: {
						aniShow: "slide-in-left"
					}
				});
			});*/
			plus.nativeUI.toast("请先登录");
		});
	}

	/*获取个人信息*/
	function personalMessage() {
		mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				orgAuth=data.data.orgAuth;
				orgId=data.data.orgId;
				var $data = data.data;
				personalMaterial[0].innerText = $data.name;
				professorName = $data.name;
				document.getElementById("professorName").innerText = $data.name;
				//基本信息
				//				if($data.consultCount){
				//					document.getElementsByClassName("consultCount")[0].innerText = $data.consultCount;
				//				}else{
				//					document.getElementById("accessHistory").style.display="none";
				//				}
//				var startLeval = parseInt($data.starLevel);
//				var start = document.getElementsByClassName("start");
//				for(var i = 0; i < startLeval; i++) {
//					start[i].classList.add("icon-favorfill");
//					start[i].classList.remove("icon-favor");
//				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = baseUrl + "/images/head/" + $data.id + "_l.jpg";
				} else {
					document.getElementsByClassName("headimg")[0].src = "../images/default-photo.jpg";
				}
				var oSty = autho($data.authType, $data.orgAuth, $data.authStatus);
				nameli.classList.add(oSty.sty);

				if($data.orgName) {
					if($data.department) {
						personalMaterial[1].innerText = $data.orgName + "，";
					} else {
						if($data.address) {
							personalMaterial[1].innerText = $data.orgName + " | ";
						} else {
							personalMaterial[1].innerText = $data.orgName
						}
					}

				}
				if($data.department) {
					if($data.address) {
						personalMaterial[2].innerText = $data.department + " | ";
					} else {
						personalMaterial[2].innerText = $data.department;
					}
				}
				if($data.address) {
					personalMaterial[3].innerText = $data.address;
				}
				//个人简介

				if($data.descp) {
					personSummary.innerHTML = $data.descp;
				} else {
					document.getElementById("professorBreifinfo").style.display = "none";
				}
				//如无详细内容数据，隐藏详细点击的按钮
				if(!$data.edus.length && !$data.jobs.length && !$data.projects.length && !$data.papers.length && !$data.patents.length && !$data.honors.length) {
					document.getElementById("detailProfessor").style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	//修改详细页面
	document.getElementById("detailProfessor").addEventListener("tap", function() {
		var nwaiting = plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/proinforbrow-more.html", "proinforbrow-more.html", {}, {
			pro: proId
		}); //后台创建webview并打开show.html   	    	
		web.addEventListener("loaded", function() {}, false);
	});

	personalMessage();

	/*咨询成功,返回专家信息*/
	window.addEventListener('backproinfo', function(event) {
		var proid = event.detail.proId;
		console.log(proid);
		/*ozixun.classList.add('displayNone');*/
	});

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		if(userid && userid != null && userid != "null") {
			collectionExpert($this);
		} else {
			plus.nativeUI.toast("请先登录");
		}
	});

	noExpert.addEventListener('tap', function() {
		var $this = this;
		cancelCollectionExpert($this);
	});

	/*判断是非收藏专家*/
	function ifCollection() {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": proId
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					yesExpert.style.display = "none";
					noExpert.style.display = "block";
					returnId = data.data.watchObject;
				} else {
					yesExpert.style.display = "block";
					noExpert.style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏专家*/
	function collectionExpert($this) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": proId,
				"watchType": 1
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					noExpert.style.display = "block";
					returnId = data.data;
					//console.log(returnId)
					plus.nativeUI.toast("专家关注成功", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏专家*/
	function cancelCollectionExpert($this) {
		//console.log(returnId)
		// console.log(userid)
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: returnId
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					yesExpert.style.display = "block";
					plus.nativeUI.toast("取消关注成功", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}
	/*进入机构浏览页面*/
	document.getElementById("department").addEventListener("tap",function(){
		if(orgAuth==1){
			mui.openWindow({
				url: '../html/cmpinfor-index.html',
				id: 'cmpinfor-index.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					orgId: orgId,
				}
			});
		}
		
	})
	//	/*专家的历史和评价*/
	//	document.getElementById("accessHistory").addEventListener('tap', function() {
	//		mui.openWindow({
	//			url: '../html/coophistory-other.html',
	//			id: 'html/coophistory-other.html',
	//			show: {
	//				autoShow: false,
	//			},
	//			extras: {
	//				professorId: proId
	//			}
	//		});
	//	})
	/*微信及微信朋友圈分享专家*/
	var auths, shares;
	document.getElementById("shareBtn").addEventListener("tap", function() {
		shareShow()
	})
	plus.oauth.getServices(function(services) {
		auths = {};
		for(var i in services) {
			var t = services[i];
			auths[t.id] = t;

		}
	}, function(e) {
		alert("获取登录服务列表失败：" + e.message + " - " + e.code);
	});
	plus.share.getServices(function(services) {

		shares = {};
		for(var i in services) {

			var t = services[i];

			shares[t.id] = t;

		}
	}, function(e) {
		alert("获取分享服务列表失败：" + e.message + " - " + e.code);
	})

	function shareShow() {
		var shareBts = [];
		// 更新分享列表
		var ss = shares['weixin'];
		if(navigator.userAgent.indexOf('StreamApp') < 0 && navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
			ss && ss.nativeClient && (shareBts.push({
					title: '微信好友',
					s: ss,
					x: 'WXSceneSession'
				}),
				shareBts.push({
					title: '微信朋友圈',
					s: ss,
					x: 'WXSceneTimeline'
				}));
		}
		//				// 弹出分享列表
		shareBts.length > 0 ? plus.nativeUI.actionSheet({
			title: '分享',
			cancel: '取消',
			buttons: shareBts
		}, function(e) {
			var str;
			if(resear) {
				str = "研究方向：" + resear
			}
			if(e.index == 1) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: str,
						title: "【科袖名片】" + professorName + " " + title + "",
						href: baseUrl + "/e/p.html?id=" + proId,
						thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
					});
				}
			} else if(e.index == 2) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: str,
						title: "【科袖名片】" + professorName + " " + title + "",
						href: baseUrl + "/e/p.html?id=" + proId,
						thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
					});
				}
			}

		}) : plus.nativeUI.alert('当前环境无法支持分享操作!');

	}

	function buildShareService() {
		var share = shares["weixin"];
		if(share) {
			if(share.authenticated) {
				console.log("---已授权---");
			} else {
				console.log("---未授权---");
				share.authorize(function() {
					console.log('授权成功...')
				}, function(e) {
					alert("认证授权失败：" + e.code + " - " + e.message);
					return null;
				});
			}
			return share;
		} else {
			alert("没有获取微信分享服务");
			return null;
		}

	}

	function shareMessage(share, ex, msg) {
		msg.extra = {
			scene: ex
		};
		share.send(msg, function() {
			plus.nativeUI.closeWaiting();
			/*var strtmp = "分享到\"" + share.description + "\"成功！ ";
			console.log(strtmp);
			plus.nativeUI.toast(strtmp, {
				verticalAlign: 'center'
			});*/
			shareAddIntegral(1);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				plus.nativeUI.toast('已取消分享', {
					verticalAlign: 'center'
				});
			}
		});
	}
	/*图像预览*/
	mui.previewImage();
});