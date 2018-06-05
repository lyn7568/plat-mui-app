mui.plusReady(function() {
	var service = {
		userid: plus.storage.getItem('userid'),
		currentWindow: plus.webview.currentWebview(),
		id: plus.webview.currentWebview().serviceId,
		ownerId: "",
		serviceName: document.getElementById("resourceName"),
		serviceTitle: document.getElementById("resourceTit"),
		serviceContent: document.getElementById("application"),
		authorAttention: document.getElementById("attenSpan"), //关注发布者按钮
		authorIndustry: document.getElementById("thisOther"), //发布者应用用途
		authorName: document.getElementById("thisName"), //发布者名字
		authorHeadImage: document.getElementById("thisPic"), //发布者图像
		authorProperty: document.getElementById("thisInfo"), //点击需要添加的属性
		authorTitle: document.getElementById("authFlag"), //职称
		baseUrl: baseUrl,
		serviceImageFlag: false,
		ajaxRequest: function(obj) {
			mui.ajax(this.baseUrl + obj.url, {
				type: obj.type,
				data: obj.parameter,
				dataType: "json",
				traditional: true,
				success: function(data) {
					if(data.success) {
						obj.fn(data);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		},
		gainServiceData: function() {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/ware/qo",
				type: "get",
				parameter: {
					id: self.id
				},
				fn: function(data) {
					plus.nativeUI.closeWaiting();
					self.currentWindow.show("slide-in-right", 150);
					var $data = data.data;
					self.serviceName.innerHTML = self.serviceTitle.innerHTML = $data.name;
					if($data.cnt) {
						self.serviceContent.innerHTML = "内容：" + $data.cnt;
					}
					if($data.cooperation) {
						var cooperation = document.getElementById("remarkContent");
						cooperation.innerHTML = $data.cooperation.replace(/\n/gi, "<br />");
						cooperation.parentNode.style.display = "block";
					}
					if($data.descp) {
						var descp = document.getElementById("detailDescp");
						descp.innerHTML = $data.descp;
						descp.parentNode.style.display = "block";
						var oImg = descp.getElementsByTagName("img");
						for(var i = 0; i < oImg.length; i++) {
							(function(n) {
								var str = oImg[n].src.substr(7);
								oImg[n].setAttribute("src", self.baseUrl + str);
							})(i);
						}
					}
					if($data.keywords) {
						var oSub = $data.keywords.split(","),
							oSt = "";
						for(var i = 0; i < oSub.length; i++) {
							oSt += '<li><span class="h2Font">' + oSub[i] + '</span></li>'
						}
						mui(".tagList")[0].innerHTML = oSt;
					}
					if($data.images) {

						var serviceImages = $data.images.split(",");
						if(serviceImages.length) {
							self.serviceImageFlag = true;
							var lastImg = document.getElementById("lastImg");
							lastImg.innerHTML = '<a class="tab-re"><img src="' + self.baseUrl + '/data/ware' + serviceImages[serviceImages.length - 1] + '" /></a>';
							var firstImg = document.getElementById("firstImg");
							firstImg.innerHTML = '<a class="tab-re"><img src="' + self.baseUrl + '/data/ware' + serviceImages[0] + '" /></a>';
							var oresorcePic = document.getElementById("resorcePic");
							for(var i = 0; i < serviceImages.length; i++) {
								var rPdiv = document.createElement("div");
								rPdiv.className = 'mui-slider-item';
								rPdiv.innerHTML = '<a class="tab-re"><img src="' + self.baseUrl + '/data/ware' + serviceImages[i] + '"/></a>'
								oresorcePic.appendChild(rPdiv, oresorcePic.firstChild);
							}
							for(var i = 1; i < serviceImages.length; i++) {
								var resorcePoint = document.getElementById("resorcePoint");
								var rPoint = document.createElement("div");
								rPoint.className = 'mui-indicator';
								resorcePoint.appendChild(rPoint);
							}
							oresorcePic.insertBefore(lastImg, oresorcePic.firstChild);
							oresorcePic.appendChild(firstImg, oresorcePic.lastChild);
						}
					} else {
						document.getElementById('slider').style.display = "none";
					}
					if($data.category === "1") {
						self.serviceAuthorPersonal($data.owner);
					} else {
						self.serviceAuthorCompany($data.owner);
					}
				}
			})
		},
		serviceAuthorPersonal: function(pId, p1, p2) {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/professor/baseInfo/" + pId,
				type: "get",
				parameter: {},
				fn: function(data) {
					var $data = data.data;
					var professorFlag = autho($data.authType, $data.orgAuth, $data.authStatus);
					if(p1 == 1) {
						p2.querySelector(".pName").innerHTML = $data.name;
						return;
					} else if(p1 == 2) {
						p2.querySelector(".pName").innerHTML = $data.name;
						p2.querySelector(".authicon").classList.add(professorFlag.sty);
						return;
					}
					self.authorProperty.setAttribute("data-id", $data.id);
					self.authorProperty.setAttribute("data-type", 1);
					self.ownerId = $data.id;
					if(self.userid != self.ownerId) {
						ifcollectionAbout(self.ownerId, self.authorAttention, 1, 1);
					} else {
						self.authorAttention.style.display = "none";
						document.getElementsByClassName('footbox')[0].style.display = "none";
					}

					//用户个人信息
					self.authorName.innerHTML = $data.name;
					var otitleInfo = "";
					var oOrgInfo = "";
					if($data.title) {
						otitleInfo = $data.title + "，";
					} else {
						if($data.office) {
							otitleInfo = $data.office + "，";
						} else {
							otitleInfo = "";
						}
					}
					if($data.orgName) {
						oOrgInfo = $data.orgName;
					}
					self.authorIndustry.innerHTML = otitleInfo + oOrgInfo;
					self.authorTitle.classList.add(professorFlag.sty);
					self.authorHeadImage.classList.add("useHead");
					if($data.hasHeadImage == 1) {
						self.authorHeadImage.style.backgroundImage = 'url(' + self.baseUrl + '/images/head/' + $data.id + '_l.jpg)';
					}
				}
			})
		},
		serviceAuthorCompany: function(pId, p1, p2) {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/org/" + pId,
				type: "get",
				parameter: {},
				fn: function(data) {
					var $data = data.data;
					if(p1 == 1) {
						p2.querySelector(".pName").innerHTML = ($data.forShort) ? $data.forShort : $data.name;
						return;
					} else if(p1 == 2) {
						p2.querySelector(".pName").innerHTML = ($data.forShort) ? $data.forShort : $data.name;
						if($data.authStatus == 3)
							p2.querySelector(".authicon").classList.add("authicon-com-ok");
						return;
					}
					self.authorProperty.setAttribute("data-id", $data.id);
					self.authorProperty.setAttribute("data-status", $data.authStatus);
					self.authorProperty.setAttribute("data-type", 2);
					self.ownerId = $data.id;
					if($data.forShort) {
						self.authorName.innerHTML = $data.forShort;
					} else {
						self.authorName.innerHTML = $data.name;
					}
					if(self.userid) {
						ifcollectionAbout(self.ownerId, self.authorAttention, 6, 1)
					}
					if($data.subject) {
						self.authorIndustry.innerHTML = ($data.subject).replace(/,/, " | ");
					}
					self.authorHeadImage.classList.add("cmpHead2");
					self.authorHeadImage.innerHTML = '<div class="boxBlock"><img class="boxBlockimg" id="companyImg" src="../images/default-icon.jpg"></div>'
					if($data.hasOrgLogo) {
						document.getElementById("companyImg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
					}
					if($data.authStatus == 3) {
						self.authorTitle.classList.add("authicon-com-ok");
					}
				}
			})
		},
		serviceAuthorPlat: function(pId, p1, p2) {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/platform/info",
				data: pId,
				type: "get",
				parameter: {},
				fn: function(data) {
					var $data = data.data;
					if(p1 == 1) {
						p2.querySelector(".pName").innerHTML = $data.name;
						return;
					} else if(p1 == 2) {
						p2.querySelector(".pName").innerHTML = $data.name;
					}
					self.authorProperty.setAttribute("data-id", $data.id);
					self.authorProperty.setAttribute("data-type", 3);
					self.ownerId = $data.id;
					if($data.industry) {
						self.authorIndustry.innerHTML = ($data.industry).replace(/,/, " | ");
					}
					self.authorHeadImage.classList.add("cmpHead2");
					self.authorHeadImage.innerHTML = '<div class="boxBlock"><img class="boxBlockimg" id="platImg" src="../images/default-plat.jpg"></div>'
					if($data.logo) {
						document.getElementById("platImg").src = baseUrl + "/data/platform/" + $data.logo;
					}
					
				}
			})
		},
		relatedArticles: function() {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/article/lq/byWare",
				type: "get",
				parameter: {
					ware: self.id,
					rows: 5
				},
				fn: function(data) {
					var $data = data.data,
						articleList = document.getElementById("likeArtical");
					if($data.length) {
						articleList.parentNode.classList.remove("displayNone");
					}
					for(var i = 0; i < $data.length; i++) {
						var li = document.createElement("li");
						li.className = 'mui-table-view-cell';
						li.setAttribute("data-id", $data[i].articleId);
						var str = '<div class="flexCenter OflexCenter">'
						if($data[i].articleImg) {
							str += '<div class="madiaHead artHead" style="background-image: url(' + self.baseUrl + '/data/article/' + $data[i].articleImg + ')"></div>'
						} else {
							str += '<div class="madiaHead artHead"></div>'
						}
						str += '<div class="madiaInfo OmadiaInfo">'
						str += '<p class="mui-ellipsis-2 h1Font">' + $data[i].articleTitle + '</p>'
						str += '<p class="h2Font mui-ellipsis">'
						str += '<span class="nameSpan pName" style="margin-right:10px"></span>'
						str += '<span class="time">' + commenTime($data[i].publishTime) + '</span>'
						str += '</p>'
						str += '</div></div>'
						li.innerHTML = str;
						articleList.appendChild(li);
						if($data[i].articleType == '1') {
							li.setAttribute("data-type", 1);
							self.serviceAuthorPersonal($data[i].ownerId, 1, li);
						} else if($data[i].articleType == '2'){
							li.setAttribute("data-type", 2);
							self.serviceAuthorCompany($data[i].ownerId, 1, li);
						} else if($data[i].articleType == '3'){
							li.setAttribute("data-type", 3);
							self.serviceAuthorPlat($data[i].ownerId, 1, li);
						}
					}
				}
			})
		},
		relatedResource: function() {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/ware/res",
				type: "get",
				parameter: {
					id: self.id
				},
				fn: function(data) {
					var $data = data.data,
						arr = [];
					for(var i = 0, len = $data.length; i < len; i++) {
						arr.push($data[i].resource);
						if(i >= len - 1) {
							self.resource(arr);
						}
					}
				}
			})
		},
		resource: function(arry) {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/resource/qm",
				type: "get",
				parameter: {
					id: arry
				},
				fn: function(data) {
					var $data = data.data,
						resourceList = document.getElementById("likeResource");
					if($data.length) {
						resourceList.parentNode.classList.remove("displayNone");
					}
					for(var i = 0, len = $data.length; i < len; i++) {
						var li = document.createElement("li"),
							img = '../images/default-resource.jpg';

						if($data[i].images.length) {
							img = self.baseUrl + '/data/resource/' + $data[i].images[0].imageSrc
						}
						li.className = "mui-table-view-cell";
						li.setAttribute("data-id", $data[i].resourceId);
						li.innerHTML = '<div class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url(' + img + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis h1Font" id="usertitle">' + $data[i].resourceName + '</p>' +
							'<p><span class="h2Font pName"></span><em class="authicon "></em></p>' +
							'<p class="mui-ellipsis">用途：' + $data[i].supportedServices + '</p></div></div>'
						resourceList.appendChild(li);
						if($data[i].resourceType == 1) {
							self.serviceAuthorPersonal($data[i].professorId, 2, li);
						} else {
							self.serviceAuthorCompany($data[i].orgId, 2, li);
						}
					}
				}
			})
		},
		likeService: function() {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/ware/ralateWare",
				type: "get",
				parameter: {
					id: self.id,
					rows: 5
				},
				fn: function(data) {
					var $data = data.data,
						arr = [];
					for(var i = 0, len = $data.length; i < len; i++) {
						arr.push($data[i].id);
						if(i >= len-1) {
							self.serviceList(arr);
						}
					}
				}
			})
		},
		serviceList: function(arry) {
			var self = this;
			self.ajaxRequest({
				url: "/ajax/ware/qm",
				type: "get",
				parameter: {
					id: arry
				},
				fn: function(data) {
					var $data = data.data,
						serviceLi = document.getElementById("likeService");
					if($data.length) {
						serviceLi.parentNode.classList.remove("displayNone");
					}
					for(var i = 0, len = $data.length; i < len; i++) {
						var li = document.createElement("li"),
							img = "../images/default-service.jpg",
							content = "";
						if($data[i].images) {
							img = self.baseUrl + '/data/ware' + $data[i].images.split(',')[0]
						}
						if($data[i].cnt) {
							content = "内容：" + $data[i].cnt;
						}
						li.className = "mui-table-view-cell";
						li.setAttribute("data-id", $data[i].id);
						li.innerHTML = '<div class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url(' + img + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis h1Font" id="usertitle">' + $data[i].name + '</p>' +
							'<p><span class="h2Font pName"></span><em class="authicon"></em></p>' +
							'<p class="mui-ellipsis">' + content + '</p></div></div>'
						serviceLi.appendChild(li);
						if($data[i].category == '1') {
							self.serviceAuthorPersonal($data[i].owner, 2, li);
						} else {
							self.serviceAuthorCompany($data[i].owner, 2, li);
						}
					}
				}
			})
		},
		pageView: function() {
			this.ajaxRequest({
				url: "/ajax/ware/incPageViews",
				type: "post",
				parameter: {
					id: this.id
				},
				fn: function() {}
			})
		},
		init: function() {
			this.gainServiceData();
			this.relatedArticles();
			this.relatedResource();
			this.likeService();
			this.pageView();
		}
	}
	service.init();
	//关键词标签点击进去搜索
	mui(".tagList").on("tap", "li", function() {
		var tagText = this.getElementsByTagName("span")[0].innerText;
		plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=2", "../html/searchListNew2.html", {}, {
			key: tagText,
			qiFlag: 7
		});
	})
	//进入资源发布者详情页面
	service.authorProperty.addEventListener("tap", function() {
		var reType = this.getAttribute("data-type");
		if(reType == "1") {
			mui.openWindow({
				url: '../html/userInforShow.html',
				id: 'html/userInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-left"
				},
				extras: {
					proid: service.ownerId
				},
			});
		} else {
			var cmpId = this.getAttribute("data-id");
			mui.openWindow({
				url: '../html/cmpInforShow.html',
				id: 'cmpInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					cmpId: service.ownerId,
				}
			});
		}

	})
	//相关文章详情
	mui('#likeArtical').on('tap', 'li', function() {
		var artId = this.getAttribute("data-id");
		var typeN = this.getAttribute("data-type");
		if(typeN == 1) {
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
				articleId: artId,
				ownerid: service.ownerId
			});
		} else {
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
				articleId: artId,
				ownerid: service.ownerId,
				flag: 1
			});
		}

	});
	//相关资源详情
	mui('#likeResource').on('tap', 'li', function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	});
	//您可能感兴趣的服务详情
	mui('#likeService').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
			serviceId: id
		});
	});
	//判断是否登录，登录才可咨询，关注，收藏
	function isLogin() {
		var userid = plus.storage.getItem('userid');
		console.log(userid)
		if(userid == null || userid == 'null' | userid == undefined | userid == 'undefined') {
			mui.openWindow({
				url: '../html/login.html',
				id: 'login.html'
			})
		}
	};
	//咨询
	document.querySelector("#consultBtn").addEventListener('tap', function() {
		var reType = service.authorProperty.getAttribute("data-type");

		isLogin();
		if(service.userid && service.userid != null && service.userid != 'null' && service.userid != undefined && service.userid != 'undefined') {
			var flag = 'ziyuan';
			var consulttitle = service.serviceName.innerHTML;
			//var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			var wechat = plus.webview.getWebviewById('weChat.html');
			var jubao = plus.webview.getWebviewById('jubao.html');

			if(wechat) {
				wechat.close();
			}
			if(jubao) {
				jubao.close()
			}
			setTimeout(function() {

				if(reType == "1") {
					mui.openWindow({
						url: '../html/weChat.html',
						id: 'weChat.html',
						show: {
							autoShow: true,
							aniShow: "slide-in-right",
						},
						extras: {
							professorId: service.ownerId,
							flag: 1
						}
					})

				} else {
					mui.ajax(baseUrl + '/ajax/ware/pro', {
						data: {
							"id": service.id,
						},
						dataType: 'json', //数据格式类型
						type: "GET",
						success: function(data) {
							if(data.success) {
								if(data.data.length == 0) {
									plus.nativeUI.toast("暂时无法取得联系", toastStyle);
									return;
								}
								var linkProfirstId = data.data[0].professor;
								mui.openWindow({
									url: '../html/weChat.html',
									id: 'weChat.html',
									show: {
										autoShow: true,
										aniShow: "slide-in-right",
									},
									extras: {
										professorId: linkProfirstId,
										flag: 1
									}
								})
							}
						},
						error: function() {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
					});
				}
			}, 100);
		}
	});
	//点击关注专家按钮
	service.authorAttention.addEventListener('tap', function() {
		var typeNum = service.authorProperty.getAttribute("data-type");
		if(service.userid && service.userid != null && service.userid != "null") {

			if(typeNum == 1) {

				if(this.className == 'mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(service.ownerId, this, 1, 1)
				} else {
					console.log(service.ownerId)
					collectionAbout(service.ownerId, this, 1, 1);
				}
			} else {
				if(this.className == 'mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(service.ownerId, this, 6, 1)
				} else {
					collectionAbout(service.ownerId, this, 6, 1);
				}
			}

		} else {
			isLogin();
		}
	});
	//点击收藏按钮
	var ocollectBtn = document.getElementById("collectBtn"); //收藏按钮
	var oifCollect = document.getElementById("ifCollect") //星星
	ifcollectionAbout(service.id, oifCollect, 2);
	ocollectBtn.addEventListener('tap', function() {
		if(service.userid && service.userid != null && service.userid != "null") {
			if(oifCollect.className == 'mui-icon iconfontnew icon-yishoucang') {
				cancelCollectionAbout(service.id, oifCollect, 10);
			} else {
				collectionAbout(service.id, oifCollect, 10);
			}
		} else {
			isLogin();
		}
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
		var oUrl = baseUrl + "/images/logo180.png";
		if(service.serviceImageFlag) {
			oUrl = document.getElementById('firstImg').querySelectorAll("img")[0].getAttribute("src").replace(/.jpg/, "_s.jpg");
		}
		if(oFen == "微信好友") {
			if(!weixinClient()) {
				return;
			}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: service.serviceContent.innerHTML,
					title: service.serviceName.innerHTML,
					href: baseUrl + "/e/s.html?id=" + service.id,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "微信朋友圈") {
			if(!weixinClient()) {
				return;
			}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: service.serviceContent.innerHTML,
					title: service.serviceName.innerHTML,
					href: baseUrl + "/e/s.html?id=" + service.id,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: service.serviceName.innerHTML + baseUrl + "/e/s.html?id=" + service.id,
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
					//alert("认证授权失败：" + e.code + " - " + e.message);
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
				shareAddIntegral(7);
			}
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {

			}
		});
	}

	moreMes();

	function moreMes() {
		document.getElementById("BtnMore").addEventListener("tap", function() {
			var oUrl = baseUrl + "/images/logo180.png";
			if(service.serviceImageFlag) {
				oUrl = document.getElementById('firstImg').querySelectorAll("img")[0].getAttribute("src").replace(/.jpg/, "_s.jpg");
			}
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
				proid: service.id,
				name: "ware",
				data: {
					content: service.serviceContent.innerHTML,
					title: service.serviceName.innerHTML,
					href: baseUrl + "/e/s.html?id=" + service.id,
					thumbs: [oUrl]
				},
				weiboData: {
					content: service.serviceName.innerHTML + baseUrl + "/e/s.html?id=" + service.id,
				}
			})
		})
	}
	document.getElementsByClassName("topback")[0].addEventListener("tap", function() {
		var web = plus.webview.getWebviewById("cmpInforShow.html");
		var web1 = plus.webview.getWebviewById("cmpInforShow-resource.html");
		if(!web1) {
			if(web)
				mui.fire(web, "newId", {
					rd: 1
				});
		}
	})
})