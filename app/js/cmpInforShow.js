mui.ready(function() {
	mui.plusReady(function() {
		plus.navigator.setStatusBarBackground("#28b8fa");
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;

		var rows = 1
		var oAjax = function(url, dataS, otype, oFun) {
				mui.ajax(baseUrl + url, {
					dataType: 'json',
					type: otype,
					data: dataS,
					traditional: true,
					success: function(res) {
						if(res.success) {
							oFun(res)
						}
					}
				});
			},
			demandListVal = function() {
				var aimId = "demandShow"
				oAjax("/ajax/demand/pq", {
					"state": '1',
					"oid": orgId,
					"pageSize": 5
				}, "get", function(res) {
					console.log(JSON.stringify(res));
					var obj = res.data.data;
					if(obj.length > 0) {
						document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
						for(var i = 0; i < obj.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							var needDate = obj[i].invalidDay;
							var lastDate = TimeTr(needDate);
							li.className = "mui-table-view-cell";
							var oString = '<div class="madiaInfo">'
							oString += '<p class="h1Font mui-ellipsis-2">' + obj[i].title + '</p>';
							oString += '<p class="h2Font mui-ellipsis-5">' + obj[i].descp + '</p>'
							oString += '<div class="showli mui-ellipsis h3Font">'
							oString += '<span>' + obj[i].province + '</span>'
							if(obj[i].duration != 0) {
								oString += '<span>预期 ' + demandDuration[obj[i].duration] + '</span>'
							}
							if(obj[i].cost != 0) {
								oString += '<span>预算 ' + demandCost[obj[i].cost] + '</span>'
							}
							oString += '<span>有效期至' + lastDate + ' </span>'
							oString += '</div>'
							oString += '</div>'
							li.innerHTML = oString
							document.getElementById(aimId).appendChild(li);
						}
					}
				})
			},
			articalListVal = function() {
				var aimId = "articelShow"
				oAjax("/ajax/article/publish", {
					"category": "2",
					"owner": orgId,
					"rows": rows
				}, "get", function(res) {
					var obj = res.data;
					if(obj.length > 0) {
						document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");

						for(var i = 0; i < obj.length; i++) {
							var hasImg = "../images/default-artical.jpg"
							if(obj[i].articleImg) {
								hasImg = baseUrl + "/data/article/" + obj[i].articleImg
							}
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].articleId);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].articleTitle + '</p>' +
								'<p class="h2Font mui-ellipsis"><span class="time">' + commenTime(obj[i].publishTime) + '</span></p>' +
								'</div>' +
								'</div>'
							document.getElementById(aimId).appendChild(li);
						}
					}
				})
			},
			resourceListVal = function() {
				var aimId = "resourceShow"
				oAjax("/ajax/resource/publish", {
					"category": "2",
					"owner": orgId,
					"rows": rows
				}, "get", function(res) {
					var obj = res.data;
					if(obj.length > 0) {
						document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
						for(var i = 0; i < obj.length; i++) {
							var cnt = "",
								hasImg = "../images/default-resource.jpg"
							if(obj[i].images.length) {
								hasImg = baseUrl + '/data/resource/' + obj[i].images[0].imageSrc
							}
							if(obj[i].supportedServices) {
								cnt = "用途：" + obj[i].supportedServices
							}
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].resourceId);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].resourceName + '</p>' +
								'<p class="mui-ellipsis h2Font">' + cnt + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById(aimId).appendChild(li);
						}
					}
				})
			},
			serviceListVal = function() {
				var aimId = "serviceShow"
				oAjax("/ajax/ware/publish", {
					"category": "2",
					"owner": orgId,
					"rows": rows
				}, "get", function(res) {
					var obj = res.data;
					if(obj.length > 0) {
						document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
						for(var i = 0; i < obj.length; i++) {
							var cnt = "",
								hasImg = "../images/default-service.jpg"
							if(obj[i].images) {
								var subs = strToAry(obj[i].images)
								if(subs.length > 0) {
									hasImg = baseUrl + "/data/ware" + subs[0]
								}
							}
							if(obj[i].cnt) {
								cnt = "内容：" + obj[i].cnt
							}
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + cnt + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById(aimId).appendChild(li);
						}
					}
				})
			},
			queryPubCount = function() {
				oAjax("/ajax/article/count/publish", { //文章总数
					"owner": orgId,
					"category": "2"
				}, "GET", function(data) {
					if(data.data > rows) {
						$("#seeMoreArtical").removeClass("displayNone")
						$("#articalNum").text(data.data);
					}
				});
				oAjax("/ajax/resource/count/publish", { //资源总数
					"owner": orgId,
					"category": "2"
				}, "GET", function(data) {
					if(data.data > rows) {
						$("#seeMoreResource").removeClass("displayNone")
						$("#resourceNum").text(data.data);
					}
				});
				oAjax("/ajax/ware/count/publish", { //服务总数
					"owner": orgId,
					"category": "2"
				}, "GET", function(data) {
					if(data.data > rows) {
						$("#seeMoreService").removeClass("displayNone")
						$("#serviceNum").text(data.data);
					}
				});
			},
			bindClickFun = function() {
				//点击收藏按钮
				var oifAttend = document.getElementById("ifAttend")
				ifcollectionAbout(orgId, oifAttend, 6);
				document.getElementById("collectBtn").addEventListener('tap', function() {
					if(userid && userid != null && userid != "null") {
						if(oifAttend.className == 'mui-icon iconfontnew icon-yishoucang') {
							cancelCollectionAbout(orgId, oifAttend, 6)
						} else {
							collectionAbout(orgId, oifAttend, 6);
						}
					} else {
						isLogin();
					}
				});
				//详细页面
				document.getElementById("goCmpBrief").addEventListener("tap", function() {
					var nwaiting = plus.nativeUI.showWaiting();
					var web = plus.webview.create("../html/cmpInforShow-more.html", "cmpInforShow-more.html", {}, {
						cmpId: orgId
					});    	    	
					web.addEventListener("loaded", function() {}, false);
				});
				document.getElementById("seeMoreResource").addEventListener("tap", function() {
					var nwaiting = plus.nativeUI.showWaiting();
					var web = plus.webview.create("../html/cmpInforShow-resources.html", "cmpInforShow-resources.html", {}, {
						cmpId: orgId
					});
					web.addEventListener("loaded", function() {}, false);
				});
				document.getElementById("seeMoreArtical").addEventListener("tap", function() {
					var nwaiting = plus.nativeUI.showWaiting();
					var web = plus.webview.create("../html/cmpInforShow-article.html", "cmpInforShow-article.html", {}, {
						cmpId: orgId
					});
					web.addEventListener("loaded", function() {}, false);
				});
				document.getElementById("seeMoreService").addEventListener("tap", function() {
					var nwaiting = plus.nativeUI.showWaiting();
					var web = plus.webview.create("../html/cmpInforShow-service.html", "cmpInforShow-service.html", {}, {
						cmpId: orgId
					});
					web.addEventListener("loaded", function() {}, false);
				});
				mui('#articelShow,#relateArt').on('tap', 'li', function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
						articleId: id,
					});
				})
				mui('#serviceShow').on('tap', 'li', function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
						serviceId: id,
					});
				})
				mui('#resourceShow').on('tap', 'li', function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
						resourceId: id
					});
				})
				mui("#demandShow").on("tap", "li", function() {
					var dId = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
						demanid: dId
					});
				})
				mui('#likePro').on('tap', 'li', function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					var webviewShow1 = plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
						cmpId: id
					});
					webviewShow1.addEventListener("loaded", function() {
						setTimeout(function() {
							plus.webview.currentWebview().close()
						}, 1000)

					}, false);
				})

			}

		pageViewLog(orgId, 6)
		companyMessage(orgId);
		relevantarticalList(); //相关文章
		likeExperts(); //感兴趣企业	
		demandListVal()
		articalListVal()
		bindClickFun()
		queryPubCount();

		function companyMessage(id) {
			mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var web = plus.webview.currentWebview()
						plus.nativeUI.closeWaiting();
						web.show("slide-in-right", 150);
						var $data = data.data;
						if($data.resMgr){
							resourceListVal();
							serviceListVal();
							document.getElementsByClassName("establishments")[0].style.display="block"
						}
						if($data.forShort) {
							document.getElementById("companyNameT").innerText = $data.forShort;
							document.getElementById("companyName").innerText = $data.forShort;
						} else {
							document.getElementById("companyNameT").innerText = $data.name;
							document.getElementById("companyName").innerHTML = $data.name;
						}

						if($data.hasOrgLogo) {
							document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
						} else {
							document.getElementById("oimg").src = "../images/default-icon.jpg";
						}
						/*企业标识*/
						if($data.authStatus == 3) {
							document.getElementById("authFlag").classList.add("authicon-com-ok");
						}

						/*所在城市*/
						if($data.city) {
							document.getElementById("address").innerHTML = '<em class="mui-icon iconfontnew icon-address"></em> ' + $data.city;
						} else {
							document.getElementById("address").style.display = "none";
						}

						/*企业简介*/
						if($data.descp) {
							document.getElementById("breifinfo").innerText = $data.descp;
						} else {
							document.getElementById("breifinfo").parentNode.style.display = "none";
						}
						/*应用行业*/
						var proOther = "";
						if($data.industry) {
							proOther = $data.industry.replace(/,/gi, " | ");
						}
						document.getElementById("industryShow").innerText = proOther;
						/*专注领域*/
						if($data.subject) {
							indu($data.subject, 'subjectShow')
						} else {
							document.getElementById("subjectShow").parentNode.parentNode.style.display = "none";
						}

					}
				}
			});
		}

		/*应用行业及领域及企业纸质*/
		function indu(oString, oSelector) {
			var arr = oString.split(",");
			var oArr = new Array();
			var i;
			for(i in arr) {
				oArr.push('<li>' + arr[i] + '</li>');
			}
			document.getElementById(oSelector).innerHTML = oArr.join("");
		}

		//相关文章信息
		function relevantarticalList() {
			mui.ajax(baseUrl + "/ajax/article/byAssOrg", {
				"type": "GET",
				"dataType": "json",
				"data": {
					"id": orgId
				},
				"async": "false",
				"traditional": true, //传数组必须加这个
				"success": function(data) {
					console.log(JSON.stringify(data));
					if(data.success && data.data != "") {
						document.getElementById("relateArt").parentNode.parentNode.classList.remove("displayNone");
						document.getElementById("relateArt").innerHTML = "";
						var StrData = data.data
						var lengthT;
						if(data.data.length > 5) {
							lengthT = 5;
						} else {
							lengthT = data.data.length
						}
						for(var i = 0; i < lengthT; i++) {
							(function(n) {
								var imgL = "../images/default-artical.jpg";
								if(StrData[i].articleImg) {
									imgL = baseUrl + '/data/article/' + StrData[i].articleImg
								}
								var oURL,oData='';
								if(StrData[i].articleType=='1') {
									oURL="/ajax/professor/baseInfo/"+StrData[i].ownerId;
								}else if(StrData[i].articleType=='2'){
									oURL="/ajax/org/" + StrData[i].ownerId;
								}else if(StrData[i].articleType=='3'){
									oURL="/ajax/platform/info";
									oData={
										id: StrData[i].ownerId 
									}
								}
								mui.ajax(baseUrl + oURL, {
									"type": "GET",
									"data": oData,
									'dataType': "json",
									"success": function(data) {
										if(data.success) {
											console.log(JSON.stringify(data));
											var add = document.createElement("li");
											add.className = "mui-table-view-cell";
											add.setAttribute("data-id", StrData[n].articleId);
											var thisName, userType, thisAuth, thisTitle
											if(data.data.forShort) {
												thisName = data.data.forShort;
											} else {
												thisName = data.data.name;
											}
											if(StrData[n].articleType == '1') {
												add.setAttribute("owner-id", data.data.id);
												add.setAttribute("data-type", 1);
											} else if(StrData[n].articleType == '2'){
												add.setAttribute("owner-id", data.data.id);
												add.setAttribute("data-type", 2);
											} else if(StrData[n].articleType == '3'){
												add.setAttribute("owner-id", data.data.id);
												add.setAttribute("data-type", 3);
											}

											var itemlist = '<div class="flexCenter OflexCenter mui-clearfix"><div class="madiaHead artHead" style="background-image:url(' + imgL + ')"></div>';
											itemlist += '<div class="madiaInfo OmadiaInfo">';
											itemlist += '<p class="mui-ellipsis-2 h1Font" id="usertitle">' + StrData[n].articleTitle + '</p>';
											itemlist += '<p><span class="h2Font" style="margin-right:10px">' + thisName + '</span><span class="time">' + commenTime(StrData[n].publishTime) + '</span></p>';
											itemlist += '</div></div>';

											add.innerHTML = itemlist;
											document.getElementById("relateArt").appendChild(add);
										}
									}
								});
							})(i);
						}
					}
				}
			});
		}

		//感兴趣
		function likeExperts() {
			mui.ajax(baseUrl + "/ajax/org/ralateOrgs", {
				"type": "get",
				"dataType": "json",
				"data": {
					"orgId": orgId
				},
				"success": function(data) {
					if(data.success && data.data) {
						var lengthT;
						if(data.data.length > 5) {
							lengthT = 5;
						} else {
							lengthT = data.data.length
						}
						for(var i = 0; i < lengthT; i++) {
							var ExpId = data.data[i].id;
							likeExpertsList(ExpId);
						}

					}
				}
			});
		}
		//感兴趣
		function likeExpertsList(ExpId) {
			mui.ajax(baseUrl + "/ajax/org/" + ExpId, {
				"type": "GET",
				"dataType": "json",
				"success": function(data) {
					if(data.success && data.data != "") {
						document.getElementById("likePro").parentNode.parentNode.classList.remove("displayNone");
						var add = document.createElement("li");
						add.setAttribute("data-id", data.data.id);
						add.className = "mui-table-view-cell";
						add.style.minHeight = "68px";
						var imgL, thisName, thisAuth, thisTitle, otherI = "";
						if(data.data.hasOrgLogo == 1) {
							imgL = baseUrl + "/images/org/" + data.data.id + ".jpg";
						} else {
							imgL = '../images/default-icon.jpg'
						}
						if(data.data.forShort) {
							thisName = data.data.forShort
						} else {
							thisName = data.data.name
						}
						if(data.data.industry) {
							otherI = data.data.industry.replace(/,/gi, " | ");
						}
						if(data.data.authStatus == 3) {
							thisAuth = "authicon-com-ok"
							thisTitle = "科袖认证企业"
						}
						var itemlist = '<div class="flexCenter OflexCenter mui-clearfix"><div class="madiaHead cmpHead"><div class="boxBlock"><img class="boxBlockimg" src="' + imgL + '" /></div></div>';
						itemlist += '<div class="madiaInfo OmadiaInfo">';
						itemlist += '<p class="mui-ellipsis"><span class="mui-ellipsis h1Font">' + thisName + '</span><em class="authicon ' + thisAuth + '" title="' + thisTitle + '"></em></p>';
						itemlist += '<p class="mui-ellipsis h2Font">' + otherI + '</p>';
						itemlist += '</div></div>';
						add.innerHTML = itemlist;
						document.getElementById("likePro").appendChild(add);

					}
				}
			});
		}

		//判断是否登录，登录才可咨询，关注，收藏
		function isLogin() {
			var userid = plus.storage.getItem('userid');
			if(userid == null || userid == 'null' | userid == undefined | userid == 'undefined') {
				mui.openWindow({
					url: '../html/login.html',
					id: 'login.html'
				})
			}
		};

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
			if(document.getElementById("oimg").src != "../images/default-icon.jpg") {
				oUrl = document.getElementById("oimg").src;
			}
			if(oFen == "微信好友") {
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: document.getElementById("industryShow").innerHTML.substr(0, 70),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId,
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
						content: document.getElementById("industryShow").innerHTML.substr(0, 70),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "新浪微博") {
				var share = buildShareService("sinaweibo");
				if(share) {
					shareMessage(share, "sinaweibo", {
						content: document.getElementById("companyName").innerHTML + baseUrl + "/e/c.html?id=" + orgId,
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
					//shareAddIntegral(2);
					shareAddIntegral(4);
				}
			}, function(e) {
				plus.nativeUI.closeWaiting();
				if(e.code == -2) {

				}
			});
		}

		/*图像预览*/
		mui.previewImage();
		moreMes();

		function moreMes() {
			document.getElementById("BtnMore").addEventListener("tap", function() {
				var oUrl = baseUrl + "/images/logo180.png";
				if(document.getElementById("oimg").src != "../images/default-icon.jpg") {
					oUrl = document.getElementById("oimg").src;
				}
				plus.nativeUI.showWaiting(); //显示原生等待框
				var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
					proid: orgId,
					name: "org",
					data: {
						content: document.getElementById("industryShow").innerHTML.substr(0, 40),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId,
						thumbs: [oUrl]
					},
					weiboData: {
						content: document.getElementById("companyName").innerHTML + baseUrl + "/e/c.html?id=" + orgId,
					}
				})
			})
		}
		window.addEventListener("newId", function(event) {
			plus.navigator.setStatusBarBackground("#28b8fa");
		})
		document.getElementsByClassName("topback")[0].addEventListener("tap", function() {
			plus.navigator.setStatusBarBackground("#FF9900");
		})
	});

})