var ozixun = document.getElementById("zixun");
var yesExpert = document.getElementById("yesExpert");
var noExpert = document.getElementById("noExpert");
var personalMaterial = document.getElementsByClassName('personalMaterial');
var personSummary = document.getElementsByClassName("breifinfo")[0];
var professorName;
var title="";
var clickFlag = true;
var orgAuth,orgId;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.proid;
	if(userid == proId) {
		document.getElementsByClassName('footbox')[0].style.display = "none";
	}
	/*点击咨询*/
	//判断是否登录，登录才可咨询，否则登录
	function isLogin() {
		var userid = plus.storage.getItem('userid');

		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {

			var flag = 'professor';
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
				'proId': proId,
				'flag': flag
			});

			webviewShow.addEventListener("loaded", function() {

			}, false);

		} else {
			mui.openWindow({
				url: '../html/login.html',
				id: 'login.html'
			})

		}
	}

	ozixun.addEventListener('tap', function() {
		isLogin();
	});

	//查询学术领域
	var subjectShow = function(data) {
			if(data != undefined && data.length != 0) {
				var subs = new Array();
				if(data.indexOf(',')) {
					subs = data.split(',');
				} else {
					subs[0] = data;
				}
				if(subs.length > 0) {
					var html = [];
					for(var i = 0; i < subs.length; i++) {
						html.push("<li>" + subs[i] + "</li>");
					};
					document.getElementsByClassName("infosubject")[0].innerHTML = html.join('');
				}
			}
		}
		//查询研究方向	
	var getRecords = function($researchAreaLogs, caption) {
		var ret = [];
		var t = 0;
		for(var i = 0; i < $researchAreaLogs.length; i++) {
			if(caption == $researchAreaLogs[i].caption) {
				ret[t] = {
					id: $researchAreaLogs[i].opreteProfessorId,
					img: $researchAreaLogs[i].hasHeadImage
				}
				t++;
			}
		}
		return ret;
	}
	var resear = "";
	var researchAreaShow = function($datas, $datarecords) {
			if($datas != undefined && $datas.length != 0) {
				var html = [];
				for(var i = 0; i < $datas.length; ++i) {
					var $data = $datas[i];
					var $photos = [];
					//获取头像					
					if($datarecords.length > 0) {
						$photos = getRecords($datarecords, $data.caption);
					}
					var isAgree = -1;
					for(var j = 0; j < $photos.length; j++) {
						if(userid == $photos[j].id)
							isAgree++;
					}
					if(userid != proId) {
						if(isAgree) {
							var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption="+$data.caption+"><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn  icon-appreciate' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption="+$data.caption+">";
						} else {
							var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption="+$data.caption+"><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn icon-appreciatefill' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption="+$data.caption+">";
						}
					} else {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'dataCaption="+$data.caption+"><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><div class='likenum' dataCaption="+$data.caption+">"
					}
					if($photos.length < 4) {
						for(var j = 0; j < $photos.length; ++j) {
							if($photos[j].img) {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
							} else {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
							}
						}
					} else {
						for(var j = $photos.length - 2; j < $photos.length; ++j) {
							if($photos[j].img) {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
							} else {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
							}
						}
						showDiv += "<span class='mui-icon iconfont icon-more likepeople likemore headRadius'></span>";
					}
					showDiv += "</div></div></div>";
					html.push(showDiv);
					resear += (i + 1) + "." + $data.caption + " ";
				}
				document.getElementsByClassName("reserachMess")[0].innerHTML = html.join('')
			}
		}
		//查询应用行业		
	var industryShow = function(data) {
		if(data != undefined && data.length != 0) {
			var subs = new Array();
			if(data.indexOf(',')) {
				subs = data.split(',');
			} else {
				subs[0] = data;
			}
			if(subs.length > 0) {
				var html = [];
				for(var i = 0; i < subs.length; i++) {
					html.push("<li>" + subs[i] + "</li>");
				};
				document.getElementsByClassName("infoapply")[0].innerHTML = html.join('');
			}
		}
	}
	var professorResource = function(odata) {
			var $data = odata;
			var html = [];
			for(var i = 0; i < odata.length; i++) {
				var string = '<li class="mui-table-view-cell mui-media listitem" resouseId=' + $data[i].resourceId + '>'
				string += '<a class="proinfor"><div class="mui-media-object mui-pull-left ResImgBox ResImgBox2">'
				if($data[i].images.length) {
					string += '<img class="resImg headRadius" src="' + baseUrl + '/images/resource/' + $data[i].resourceId + '.jpg">'

				} else {

					string += '<img class="resImg headRadius" src="../images/default-resource.jpg">'
				}
				string += '</div><div class="mui-media-body">'
				string += '<span class="listtit mui-ellipsis-2">' + $data[i].resourceName + '</span>'
				string += '<p class="listtit2 mui-ellipsis-2">' + $data[i].supportedServices + '</p>'
					//				string += '<p class="listtit3 resbrief">'
					//				if($data[i].descp) {
					//					string += $data[i].descp;
					//				}
					//				string += '</p>'
				string += '</div></a></li>'
				html.push(string);
			}
			document.getElementById("resourceList").innerHTML = html.join('');

		}
		/*获取个人信息*/
	function personalMessage() {
		mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				orgAuth=data.data.orgAuth;
				orgId=data.data.orgId;
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				var $data = data.data;
				personalMaterial[0].innerText = $data.name;
				professorName = $data.name;
				document.getElementById("professorName").innerText = $data.name;
				//基本信息
				var startLeval = parseInt($data.starLevel);
				if($data.consultCount) {
					document.getElementsByClassName("consultCount")[0].innerText = $data.consultCount;
					if(!startLeval) {
						clickFlag = false;
						document.getElementById("NoActive").classList.add("NoActive");
						document.getElementsByClassName("levelbox")[0].style.display = "none";
						document.getElementById("accessHistory").classList.remove("mui-navigate-right");
					}
				} else {
					document.getElementById("accessHistory").style.display = "none";
				}

				var start = document.getElementsByClassName("start");
				for(var i = 0; i < startLeval; i++) {
					start[i].classList.add("icon-favorfill");
					start[i].classList.remove("icon-favor");
				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = baseUrl + "/images/head/" + $data.id + "_l.jpg";
				} else {
					document.getElementsByClassName("headimg")[0].src = "../images/default-photo.jpg";
				}
				
				var oSty = autho($data.authType, $data.orgAuth, $data.authStatus);
				nameli.classList.add(oSty.sty);

				if($data.office) {
					if($data.title) {
						personalMaterial[1].innerText = $data.office + "，";
					} else {
						personalMaterial[1].innerText = $data.office;
					}
				}
				if($data.title) {
					personalMaterial[2].innerText = $data.title;
					title = $data.title;
				}
				if($data.orgName) {
					if($data.department) {
						personalMaterial[3].innerText = $data.orgName + " , ";
					} else {
						if($data.address) {
							personalMaterial[3].innerText = $data.orgName + " | ";
						} else {
							personalMaterial[3].innerText = $data.orgName;
						}
					}

				}
				if($data.department) {
					if($data.address) {
						personalMaterial[4].innerText = $data.department + " | ";
					} else {
						personalMaterial[4].innerText = $data.department;
					}

				}
				if($data.address) {
					personalMaterial[5].innerText = $data.address;
				}
				//个人简介

				if($data.descp) {
					personSummary.innerHTML = $data.descp;
				} else {
					document.getElementById("professorBreifinfo").style.display = "none";
				}
				//学术领域
				if($data.subject) {
					subjectShow($data.subject);
				} else {
					document.getElementById("professorInfosubject").style.display = "none";
				}
				//研究方向
				if($data.researchAreas.length) {

					researchAreaShow($data.researchAreas, $data.editResearchAreaLogs);
				} else {
					document.getElementById("professorReserachMess").style.display = "none";
				}
				//应用行业
				if($data.industry) {
					industryShow($data.industry);
				} else {
					document.getElementById("professorinfoapply").style.display = "none";
				}
				//专家资源
				if($data.resources.length) {
					professorResource($data.resources);
				} else {
					document.getElementById("professorresourceList").style.display = "none";
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
	//点赞
	var clFlag = 1;
	mui(".reserachMess").on("click", ".plusbtn", function() {

		if(userid && userid != null && userid != "null") {
			if(clFlag) {
				clFlag = 0;
			} else {
				return;
			}
			if(this.getAttribute("data-isagree") > -1) {
				this.classList.remove("icon-appreciatefill");
				this.classList.add("icon-appreciate");
			} else {
				this.classList.add("icon-appreciatefill");
				//this.classlist.remove("plusbtn");
			}

			mui.ajax(this.getAttribute("data-isagree") > -1 ? baseUrl + "/ajax/researchArea/unAgree" : baseUrl + "/ajax/researchArea/agree", {
				"type": "POST",
				"data": {
					"targetId": this.getAttribute("data-pid"),
					"targetCaption": this.getAttribute("data-caption"),
					"opId": userid
				},
				"contentType": "application/x-www-form-urlencoded",
				"success": function($data) {

					if($data.success) {
						mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
							dataType: 'json', //数据格式类型
							type: 'GET', //http请求类型
							timeout: 10000, //超时设置
							success: function(data) {
								clFlag = 1;
								var $data = data.data;
								//研究方向
								document.getElementsByClassName("reserachMess")[0].innerHTML = "";
								if($data.researchAreas.length) {

									researchAreaShow($data.researchAreas, $data.editResearchAreaLogs);
								}

							},
							error: function() {
								plus.nativeUI.toast("服务器链接超时", toastStyle);
								return;
							}
						});
					}

				}
			})
		} else {
			//			plus.nativeUI.toast("请先登录");
			isLogin();
		}

	})

	personalMessage();
	/*专家文章*/
	mui.ajax(baseUrl + "/ajax/article/qaPro", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data: {
			"professorId": proId
		},
		timeout: 10000, //超时设置
		success: function(data) {
			if(data.success) {
				var $data = data.data;
				if($data.length==0){
					document.getElementById("professorArticleList").style.display="none";
					return;
				}
				var html = [];
				for(var i = 0; i < $data.length; i++) {					
					var string = '<li class="mui-table-view-cell mui-media listitem" articleId=' + $data[i].articleId + '>'
					string += '<a class="proinfor" style="position:relative;"><div class="mui-media-object mui-pull-left ResImgBox ResImgBox2">'
					if($data[i].articleImg){
						string += '<img class="resImg headRadius" src="'+baseUrl+'/data/article/'+$data[i].articleImg+'">'
					}else{
						string += '<img class="resImg headRadius" src="../images/default-artical.jpg">'
					}
					string += '</div><div class="mui-media-body centerTit">'
					string += '<span class="listtit mui-ellipsis-2" >' + $data[i].articleTitle + '</span>'
					string += '</div></a></li>'
					html.push(string);
				}
				document.getElementById("articleList").innerHTML = html.join('');
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
	/*进入文章详细页面*/
	mui("#professorArticleList").on('tap', 'li', function() {
		var artId = this.getAttribute("articleId");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
			articleId: artId,
			ownerid:proId
		});
	});
	/*进入资源详细页面*/
	mui("#resourceList").on('tap', 'li', function() {
		var resouId = this.getAttribute("resouseId");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resinforbrow.html", 'resinforbrow.html', {}, {
			resourceId: resouId
		});
	});
	/*进入研究方向点赞页面*/
	mui("#professorReserachMess").on('tap', '.listbrowse,.likenum', function() {
		
		var dataCap = this.getAttribute("dataCaption");
		plus.nativeUI.showWaiting();
		plus.webview.close("researchAreaHead.html");
		setTimeout(function(){
			plus.webview.create("../html/researchAreaHead.html", 'researchAreaHead.html', {}, {
			dataCaption: dataCap,
			professorId:proId
		});
		},500);
		
		
	});
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
			//			plus.nativeUI.toast("请先登录");
			isLogin();
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
	/*专家的历史和评价*/
	document.getElementById("accessHistory").addEventListener('tap', function() {
			if(!clickFlag) return;
			mui.openWindow({
				url: '../html/coophistory-other.html',
				id: 'html/coophistory-other.html',
				show: {
					autoShow: false,
				},
				extras: {
					professorId: proId
				}
			});
		})
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
						href: baseUrl + "/ekexiu/shareProinfor.html?professorId=" + proId,
						thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
					});
				}
			} else if(e.index == 2) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: str,
						title: "【科袖名片】" + professorName + " " + title + "",
						href: baseUrl + "/ekexiu/shareProinfor.html?professorId=" + proId,
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