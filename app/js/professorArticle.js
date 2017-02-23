mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.articleId;
	var proticleName="";
	var oImgShare=""
	console.log(userid)
	function proInfoMain() {
		mui.ajax(baseUrl + "/ajax/article/query", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"articleId": proId
			},
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(JSON.stringify(data))
				var $info = data.data || {};
				if(data.success && data.data) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					var nameli = document.getElementById("nameli");
					var proZlist = document.getElementById("proZlist"); //专家资源
					var proRlist = document.getElementById("proRlist"); //专家资源
					var proName = document.getElementById("proName");
					var proTitle = document.getElementById("proTitle");
					var proOffice = document.getElementById("proOffice");
					var proOrg = document.getElementById("proOrg");
					var proAddress = document.getElementById("proAddress");
					var articleImg = document.getElementById("articleImg");
					var artical_topic = document.getElementById("artical_topic");
					var main_content = document.getElementById("main_content");
					proName.innerText = $info.professor.name;
					if($info.professor.title && $info.professor.office && $info.professor.orgName && $info.professor.address) {
						proTitle.innerText = $info.professor.title + "，";
						proOffice.innerText = $info.professor.office + "，";
						proOrg.innerText = $info.professor.orgName + " | ";
						proAddress.innerText = $info.professor.address;
					} else if(!$info.professor.title && $info.professor.office && $info.professor.orgName && $info.professor.address) {
						proOffice.innerText = $info.professor.office + "，";
						proOrg.innerText = $info.professor.orgName + " | ";
						proAddress.innerText = $info.professor.address;
					} else if($info.professor.title && !$info.professor.office && $info.professor.orgName && $info.professor.address) {
						proTitle.innerText = $info.professor.title + "，";
						proOrg.innerText = $info.professor.orgName + " | ";
						proAddress.innerText = $info.professor.address;
					} else if($info.professor.title && $info.professor.office && !$info.professor.orgName && $info.professor.address) {
						proTitle.innerText = $info.professor.title + "，";
						proOffice.innerText = $info.professor.office + " | ";
						proAddress.innerText = $info.professor.address;
					} else if($info.professor.title && $info.professor.office && $info.professor.orgName && !$info.professor.address) {
						proTitle.innerText = $info.professor.title + "，";
						proOffice.innerText = $info.professor.office + "，";
						proOrg.innerText = $info.professor.orgName;
					} else if(!$info.professor.title && !$info.professor.office && $info.professor.orgName && $info.professor.address) {
						proOrg.innerText = $info.professor.orgName + " | ";
						proAddress.innerText = $info.professor.address;
					} else if(!$info.professor.title && $info.professor.office && !$info.professor.orgName && $info.professor.address) {
						proOffice.innerText = $info.professor.office + " | ";
						proAddress.innerText = $info.professor.address;
					} else if(!$info.professor.title && $info.professor.office && $info.professor.orgName && !$info.professor.address) {
						proOffice.innerText = $info.professor.office + "，";
						proOrg.innerText = $info.professor.orgName;
					} else if($info.professor.title && !$info.professor.office && !$info.professor.orgName && $info.professor.address) {
						proTitle.innerText = $info.professor.title + " | ";
						proAddress.innerText = $info.professor.address;
					} else if($info.professor.title && !$info.professor.office && $info.professor.orgName && !$info.professor.address) {
						proOffice.innerText = $info.professor.title + "，";
						proAddress.innerText = $info.professor.orgName;
					} else if($info.professor.title && $info.professor.office && !$info.professor.orgName && !$info.professor.address) {
						proTitle.innerText = $info.professor.title + "，";
						proOffice.innerText = $info.professor.office;
					} else if(!$info.professor.title && !$info.professor.office && !$info.professor.orgName && $info.professor.address) {
						proAddress.innerText = $info.professor.address;
					} else if(!$info.professor.title && !$info.professor.office && $info.professor.orgName && !$info.professor.address) {
						proOrg.innerText = $info.professor.orgName;
					} else if(!$info.professor.title && $info.professor.office && !$info.professor.orgName && !$info.professor.address) {
						proOffice.innerText = $info.professor.office;
					} else if($info.professor.title && !$info.professor.office && !$info.professor.orgName && !$info.professor.address) {
						proTitle.innerText = $info.professor.title;
					}
					var rlist = ''
					for(var n = 0; n < $info.professor.researchAreas.length; n++) {
						rlist += '<span>' + $info.professor.researchAreas[n].caption + '</span>';
						if(n != $info.professor.researchAreas.length - 1) {
							rlist += '，';
						}
					}
					($info.professor.researchAreas) ? proRlist.innerHTML = rlist: proRlist.innerText = '';
					var zlist = "";
					for(var n = 0; n < $info.professor.resources.length; n++) {
						zlist += '<span>' + $info.professor.resources[n].resourceName + '</span>';
						if(n != $info.professor.resources.length - 1) {
							zlist += '，';
						}
					}
					//console.log(oImg)
					//alert(oImg)
					($info.professor.resources) ? proZlist.innerHTML = zlist: proZlist.innerText = '';
					if($info.articleImg) {
						articleImg.style.backgroundImage = 'url(' + baseUrl + '/data/article/' + $info.articleImg + ')';
					}
					if($info.professor.hasHeadImage) {
						document.getElementById('proHead').src = baseUrl + "/images/head/" + $info.professorId + "_l.jpg";
					}
					artical_topic.innerText = $info.articleTitle;
					proticleName= $info.articleTitle;
					if($info.articleContent) {
						main_content.innerHTML = $info.articleContent;
						oImgShare=main_content.innerText;
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
	proInfoMain();
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
						content: oImgShare,
						title: "【科袖文章】"+proticleName,
						href: baseUrl + "/ekexiu/shareArticalinfor.html?articleId="+proId ,
						thumbs: [baseUrl + "/images/logo180.png"]
					});
				}
			} else if(e.index == 2) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: oImgShare,
						title: "【科袖文章】"+proticleName,
						href: baseUrl + "/ekexiu/shareArticalinfor.html?articleId="+proId ,
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