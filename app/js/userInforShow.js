mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var ozixun = document.getElementById("consultBtn");
	var proId = self.proid;
	var title="";
	if(userid == proId) {
		document.getElementsByClassName('footbox')[0].style.display = "none";
	}
	var induSubjectShow = function(obj) {
		console.log(JSON.stringify(obj));
		if(obj.data != undefined && obj.data.length != 0) {
			var subs = new Array();
			if(obj.data.indexOf(',')) {
				subs = obj.data.split(',');
			} else {
				subs[0] = obj.data;
			}
			if(subs.length > 0) {
				var html = [];
				for(var i = 0; i < subs.length; i++) {
					html.push("<li>" + subs[i] + "</li>");
				};
				document.getElementById(obj.selector).innerHTML = html.join('');
			}
		}
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
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn  icon-appreciate' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption=" + $data.caption + ">";
					} else {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn icon-appreciatefill' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption=" + $data.caption + ">";
					}
				} else {
					var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><div class='likenum' dataCaption=" + $data.caption + ">"
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
	personalMessage();
	var authName = "";
	/*获取个人信息*/
	function personalMessage() {
		mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				var $data = data.data;
				document.getElementById("professorName").innerHTML = $data.name;
				document.getElementById("professor").innerHTML = $data.name;
				getPaper($data.name);
				getPatent($data.name);
				authName = $data.name;
				//基本信息
				if($data.descp) {
					document.getElementById("descp").innerHTML = $data.descp;
				} else {
					document.getElementById("descp").style.display = "none";
				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = baseUrl + "/images/head/" + $data.id + "_l.jpg";
				}
				var oSty = autho($data.authType, $data.orgAuth, $data.authStatus);
				document.getElementById("nameLi").classList.add(oSty.sty);
				var arr = new Array();
				if($data.title) {
					arr.push($data.title);
					title = $data.title;
				} else {
					if($data.office) {
						arr.push($data.office);
					}
				}

				if($data.department) {
					arr.push($data.department);
				}
				if($data.orgName) {
					arr.push($data.orgName);
				}
				if(arr.length) {
					document.getElementById("tMess").innerHTML = arr.join("，")
				}

				if($data.address) {
					document.getElementById("address").innerHTML = '<em class="mui-icon iconfontNew icon-address"></em> ' + $data.address;
				}

				//学术领域
				if($data.subject) {
					induSubjectShow({
						data: $data.subject,
						selector: "subjectlist"
					});
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
					induSubjectShow({
						data: $data.industry,
						selector: "industry1"
					});
				} else {
					document.getElementById("professorinfoapply").style.display = "none";
				}
				return;
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
	/*进入个人简介页面*/
	document.getElementById("detailProfessor").addEventListener("tap", function() {
		plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/userInforShow-more.html", 'userInforShow-more.html', {}, {
			pId: proId
		})
	})
	/*资源及文章*/
	//获取资源
	getResource()

	function getResource() {
		mui.ajax(baseUrl + "/ajax/resource/pqProPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"professorId": proId
			},
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						document.getElementById("resourceNum").innerText = obj.length;
						if(obj.length > 2) {
							obj.length = 2;
							document.getElementById("seeMoreResource").classList.remove("displayNone");
						}
						for(var i = 0; i < obj.length; i++) {
							var liItem = document.createElement("li");
							liItem.className = "mui-table-view-cell"
							liItem.setAttribute("data-id", obj[i].resourceId)
							var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
							if(obj[i].images.length) {
								oString += '<div class="madiaHead resouseHead" style="background-image:url(' + baseUrl + '/data/resource/' + obj[i].images[0].imageSrc + ')"></div>'
							} else {
								oString += '<div class="madiaHead resouseHead"></div>'
							}
							oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis">应用用途：' + obj[i].supportedServices + '</p>'
							oString += '</div></div>'
							liItem.innerHTML = oString;
							document.getElementById("resourceShow").appendChild(liItem);
						}
					} else {
						document.getElementById("resourceShow").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	}
	/*企业文章html*/
	getArticel();

	function getArticel() {
		mui.ajax(baseUrl + "/ajax/article/pqProPublish", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"professorId": proId
			},
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						document.getElementById("articalNum").innerText = obj.length;
						if(obj.length > 2) {
							obj.length = 2;
							document.getElementById("seeMoreArtical").classList.remove("displayNone");
						}
						for(var i = 0; i < obj.length; i++) {
							var liItem = document.createElement("li");
							liItem.setAttribute("data-id", obj[i].articleId);
							liItem.setAttribute("owner-id", obj[i].professorId);
							liItem.className = "mui-table-view-cell"
							var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
							if(obj[i].articleImg) {
								oString += '<div class="madiaHead artHead" style="background-image:url(' + baseUrl + '/data/article/' + obj[i].articleImg + ')"></div>'
							} else {
								oString += '<div class="madiaHead artHead"></div>'
							}
							oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis-2 h1Font">' + obj[i].articleTitle + '</p>'
							oString += '</div></div>'
							liItem.innerHTML = oString;
							document.getElementById("articelShow").appendChild(liItem);
						}
					} else {
						document.getElementById("articelShow").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	}
	/*论文html*/
	function getPaper(oName) {
		mui.ajax(baseUrl + "/ajax/ppaper/byAuthor", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": proId,
				"author": oName
			},
			success: function(data) {
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						document.getElementById("paperNum").innerText = obj.length;
						if(obj.length > 2) {
							obj.length = 2;
							document.getElementById("seeMorePaper").classList.remove("displayNone");
						}
						for(var i = 0; i < obj.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead artHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("paper").appendChild(li);
						}
					} else {
						document.getElementById("paper").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	}
	/*论文html*/
	function getPatent(oName) {
		mui.ajax(baseUrl + "/ajax/ppatent/byAuthor", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": proId,
				"author": oName
			},
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data.success) {
					var obj = data.data.data;
					if(obj.length > 0) {
						document.getElementById("patentNum").innerText = obj.length;
						if(obj.length > 2) {
							obj.length = 2;
							document.getElementById("seeMorePatent").classList.remove("displayNone");
						}
						for(var i = 0; i < obj.length; i++) {
							var li = document.createElement("li");
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead patentHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("patent").appendChild(li);
						}
					} else {
						document.getElementById("patent").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
	}
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
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras:{
					ourl:self.id
				}
			});
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
	/*进入研究方向点赞页面*/
	mui("#professorReserachMess").on('tap', '.listbrowse,.likenum', function() {
		var dataCap = this.getAttribute("dataCaption");
		plus.nativeUI.showWaiting();
		plus.webview.close("researchAreaHead.html");
		setTimeout(function() {
			plus.webview.create("../html/researchAreaHead.html", 'researchAreaHead.html', {}, {
				dataCaption: dataCap,
				professorId: proId
			});
		}, 500);
	});

	ozixun.addEventListener('tap', function() {
		isLogin();
	});
	ifcollectionAbout(proId, '1');
	document.getElementById('ifAttend').addEventListener("tap", function() {
		if(!userid) {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras:{
					ourl:self.id
				}
			});
		}
		if(this.className == "mui-icon iconfontnew icon-yishoucang") {
			cancelCollectionAbout(proId, '1');
		} else {
			collectionAbout(proId, '1');
		}

	})
	mui("#resourceShow").on("tap", "li", function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	})
	mui("#articelShow").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		var ownerid = this.getAttribute("owner-id");
		console.log(id);
		console.log(ownerid)
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
			articleId: id,
			ownerid: ownerid,
		});
	})
	mui("#paper").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/paperShow.html", 'paperShow.html', {}, {
			"paperId": id
		});
	})
	mui("#patent").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/patentShow.html", 'patentShow.html', {}, {
			"patentId": id
		});
	})
	document.getElementById("seeMoreResource").addEventListener("tap", function() {
		console.log(proId)
		plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/resourceList.html", 'resourceList.html', {}, {
			proid: proId
		})
	})
	document.getElementById("seeMorePatent").addEventListener("tap", function() {
		plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/patentList.html", 'patentList.html', {}, {
			proid: proId,
			authName: authName
		})
	})
	document.getElementById("seeMorePaper").addEventListener("tap", function() {
		plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/paperList.html", 'paperList.html', {}, {
			proid: proId,
			authName: authName
		})
	})
	document.getElementById("seeMoreArtical").addEventListener("tap", function() {
		plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/aiticleList.html", 'aiticleList.html', {}, {
			proid: proId
		})
	})
	window.addEventListener("newId", function(event) {
		personalMessage();
		userid = plus.storage.getItem('userid')
		if(userid == proId) {
			document.getElementsByClassName('footbox')[0].style.display = "none";
		}
		ifcollectionAbout(proId, '1');
	});
	/*微信及微信朋友圈分享专家*/
	var auths, shares;
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
	});
	mui("#shareBlock").on("tap", "li", function() {
		document.getElementById("shareBlock").style.display = "none";
		document.getElementById("maskBlack").style.display = "none";
		var oFen = this.getElementsByTagName("span")[0].innerHTML;
		var str;
			if(resear) {
				str = "研究方向：" + resear
			}
		if(oFen == "微信好友") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: str,
					title: "【科袖名片】" + authName + " " + title + "",
					href: baseUrl + "/e/p.html?id=" + proId,
					thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
				});
			}
		} else if(oFen == "微信朋友圈") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: str,
					title: "【科袖名片】" + authName + " " + title + "",
					href: baseUrl + "/e/p.html?id=" + proId,
					thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content:  "【科袖名片】" + authName + " " + title + ""+baseUrl + "/e/p.html?id=" + proId
				});
			}
		}

	})

	function buildShareService(ttt) {
		var share = shares[ttt];
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
			if(plus.storage.getItem('userid')) {
				shareAddIntegral(3);
			}

		}, function(e) {
			console.log(JSON.stringify(e))
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