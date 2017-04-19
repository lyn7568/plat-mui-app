mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.articleId;
	var ownerid = self.ownerid;
	var oFlag = self.oFlag;
	var proticleName = "";
	var oImgShare = ""
	if(oFlag == 1) {
		comBro();
		mui.ajax(baseUrl + "/ajax/org/authStatus", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			data: {
				"id": ownerid
			},
			success: function(data) {
				if(data.success) {
					if(data.data == 3) {
						document.getElementById("proInfor").addEventListener("tap", function() {
						mui.openWindow({
							url: '../html/cmpinfor-index.html',
							id: 'cmpinfor-index.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-right",
							},
							extras: {
								orgId: ownerid,
							}
						})
						})
					} else {
						document.getElementById("proInfor").addEventListener("tap", function() {
						mui.openWindow({
							url: '../html/cmpinfor-Unindex.html',
							id: 'cmpinfor-Unindex.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-right",
							},
							extras: {
								orgId: ownerid,
								flag: 0
							}
						})
						})
					}
				}
			},
			error: function(XMLHttpRequest) {
				console.log(XMLHttpRequest)
			}
		});
	} else {
		personMess();
		document.getElementById("proInfor").addEventListener("tap", function() {
			plus.nativeUI.showWaiting(); //显示原生等待框
			webviewShow = plus.webview.create("../html/proinforbrow.html", 'proinforbrow.html', {}, {
				proid: ownerid
			}); //后台创建webview并打开show.html
		})
	}

	function proInfoMain() {
		mui.ajax(baseUrl + "/ajax/article/query", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"articleId": proId
			},
			timeout: 10000, //超时设置
			success: function(data) {
				var $info = data.data || {};
				if(data.success && data.data) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					var articleImg = document.getElementById("articleImg");
					var artical_topic = document.getElementById("artical_topic");
					var main_content = document.getElementById("main_content");
					if(data.data.createTime) {
						var oTime = timeGeshi(data.data.createTime);
						document.getElementById("proRlist").innerText = oTime;
					}
					if($info.articleImg) {
						articleImg.style.backgroundImage = 'url(' + baseUrl + '/data/article/' + $info.articleImg + ')';
					}
					artical_topic.innerText = $info.articleTitle;
					proticleName = $info.articleTitle;
					if($info.articleContent) {
						main_content.innerHTML = $info.articleContent;
						oImgShare = main_content.innerText;
						var oImg = main_content.getElementsByTagName("img");
						for(var i = 0; i < oImg.length; i++) {
							(function(n) {
								var att = oImg[n].src.substr(7);
								oImg[n].setAttribute("src", baseUrl + att);
							})(i);
						}
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	/*个人信息*/
	function personMess() {
		mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + ownerid, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				if(data.success && data.data) {
					var $profesor = data.data;
					if($profesor.hasHeadImage) {
						document.getElementById('proHead').src = baseUrl + "/images/head/" + $profesor.id + "_l.jpg";
					} else {
						document.getElementById('proHead').src = "images/default-photo.jpg";
					}
					var proName = document.getElementById("proName");
					proName.innerText = $profesor.name;
				}
			},
			error: function(XMLHttpRequest) {
				console.log(XMLHttpRequest)
			}
		});
	}
	/*企业信息*/
	function comBro() {
		mui.ajax(baseUrl + "/ajax/org/" + ownerid, {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					var $data = data.data;
					var proName = document.getElementById("proName");
					proName.innerText = $data.name;
					if($data.authStatus == 3) {
						document.getElementById("flSta").className = "mui-icon iconfont authicon authicon-com-ok"; //authiconNew
					} else {
						document.getElementById("flSta").className = "mui-icon iconfont authicon";
					}
					if($data.hasOrgLogo) {
						document.getElementById('proHead').src = baseUrl + "/images/org/" + $data.id + ".jpg";
					} else {
						document.getElementById('proHead').src = "images/default-icon.jpg";
					}

				} else {}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				console.log(JSON.stringify(data));
			}
		})
	}
	proInfoMain();
	/*时间格式*/
	/*时间格式转换*/
	function timeGeshi(otm) {
		var otme = otm.substring(0, 4) + "年" + otm.substring(4, 6) + "月" + otm.substring(6, 8) + "日";
		return otme;
	}
	/*进入留言*/
	document.getElementById("leaveWord").addEventListener("tap", function() {
			var userid = plus.storage.getItem('userid');
			if(!userid) {
				goLoginFun();
				return;
			}
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/articalMessage.html", "articalMessage.html", {}, {
				articleId: proId
			}); //后台创建webview并打开show.html   	    	
		})
		/*点赞文章*/
		/*企业信息*/
		var oThumsflag;
	function thums(dataUrl) {
		var userid = plus.storage.getItem('userid');
		mui.ajax(baseUrl + dataUrl, {
			type: "POST",
			timeout: 10000,
			dataType: "json",
			data:{
				operateId:userid,
				articleId:proId,
			},
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					console.log(JSON.stringify(data));
					var oNumber=document.getElementById("thumbsUp").getElementsByTagName("span")[0];
					if(oThumsflag==0){
						document.getElementById("appreciate").style.display="none";
						document.getElementById("appreciatefill").style.display="block";
						oNumber.innerHTML=Number(oNumber.innerHTML)+1;
						document.getElementById("thumbsUp").setAttribute("oThumsflag","1");
					}else if(oThumsflag==1){
						document.getElementById("appreciate").style.display="block";
						document.getElementById("appreciatefill").style.display="none";
						oNumber.innerHTML=Number(oNumber.innerHTML)-1;
						document.getElementById("thumbsUp").setAttribute("oThumsflag","0");
					}
					
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				console.log(JSON.stringify(XMLHttpRequest));
			}
		})
	}
		document.getElementById("thumbsUp").addEventListener("tap",function(){
			var userid = plus.storage.getItem('userid');
			var oUrl;
			oThumsflag=this.getAttribute("oThumsflag");
			console.log(oThumsflag)
			if(!userid) {
				goLoginFun();
				return;
			}
			(oThumsflag==0)?oUrl="/ajax/article/agree":oUrl="/ajax/article/unAgree";
			console.log(oUrl);
			thums(oUrl);
		})
		/*收藏文章*/
		var oCollectFlag;

	function collect() {
		var userid = plus.storage.getItem('userid');
		if(oCollectFlag == 0) {
			mui.ajax(baseUrl + "/ajax/watch", {
				type: "POST",
				timeout: 10000,
				dataType: "json",
				data: {
					"professorId": userid,
					"watchObject": proId,
					"watchType": 3
				},
				beforeSend: function() {},
				success: function(data, textState) {
					if(data.success) {
						plus.nativeUI.toast("收藏成功", toastStyle);
						document.getElementById("collect").setAttribute("collectFlag","1");
						document.getElementById("yesExpert").style.display="none";
						document.getElementById("noExpert").style.display="block";
					}
				},
				error: function(XMLHttpRequest, textStats, errorThrown) {
					console.log(JSON.stringify(XMLHttpRequest));
				}
			})
		} else {
			mui.ajax(baseUrl + "/ajax/watch/delete", {
				"type": "POST",
				"data": {
					"professorId": userid,
					"watchObject": proId,
				},
				"success": function(data) {
					if(data.success) {
						if(data.success) {
							plus.nativeUI.toast("已取消收藏", toastStyle);
							document.getElementById("collect").setAttribute("collectFlag","0");
							document.getElementById("yesExpert").style.display="block";
							document.getElementById("noExpert").style.display="none";
						} 
					}
				},
				"error": function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
	}
		document.getElementById("collect").addEventListener("click",function(){
			var userid = plus.storage.getItem('userid');
			oCollectFlag=this.getAttribute("collectFlag");
			if(!userid) {
				goLoginFun();
				return;
			}
			collect();
		})
		/*进入文章浏览页面判断是否收藏文章*/
		attentionArticle();
		function attentionArticle(){
			if(!userid){
				return;
			}
			mui.ajax(baseUrl + "/ajax/watch/hasWatch", {
				type: "GET",
				timeout: 10000,
				dataType: "json",
				data: {
					"professorId": userid,
					"watchObject": proId
				},
				success: function(data) {
					if(data.success) {
						if(data.data==null){
							document.getElementById("collect").setAttribute("collectFlag","0");
							document.getElementById("yesExpert").style.display="block";
							document.getElementById("noExpert").style.display="none";
						}else{
						document.getElementById("collect").setAttribute("collectFlag","1");
						document.getElementById("yesExpert").style.display="none";
						document.getElementById("noExpert").style.display="block";
						}
					}
				},
				error: function(XMLHttpRequest, textStats, errorThrown) {
					console.log(JSON.stringify(XMLHttpRequest));
				}
			})
		}
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
			if(e.index == 1) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: oImgShare.substring(0,70),
						title: "【科袖文章】" + proticleName,
						href: baseUrl + "/ekexiu/shareArticalinfor.html?articleId=" + proId,
						thumbs: [baseUrl + "/images/logo180.png"]
					});
				}
			} else if(e.index == 2) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: oImgShare.substring(0,70),
						title: "【科袖文章】" + proticleName,
						href: baseUrl + "/ekexiu/shareArticalinfor.html?articleId=" + proId,
						thumbs: [baseUrl + "/images/logo180.png"]
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
			var strtmp = "分享到\"" + share.description + "\"成功！ ";
			console.log(strtmp);
			plus.nativeUI.toast(strtmp, {
				verticalAlign: 'center'
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				plus.nativeUI.toast('已取消分享', {
					verticalAlign: 'center'
				});
			}
		});
	}
});