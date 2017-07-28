
mui.ready(function() {
	mui.plusReady(function() {
		plus.navigator.setStatusBarBackground( "#28b8fa" );
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		//orgId = "A93B9348F2094D12A6DC9A23F16E1246";
		companyMessage(orgId);
		getArticel();
		getResource()
		
		//点击收藏按钮
		ifcollectionAbout(orgId,6);
		document.getElementById("collectBtn").addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(document.getElementById("ifAttend").className=='mui-icon iconfontnew icon-yishoucang'){
					cancelCollectionAbout(orgId,6)
				} else {
					collectionAbout(orgId,6);
				}
			}else{
				isLogin();
			}
		});
		//详细页面
		document.getElementById("goCmpBrief").addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/cmpInforShow-more.html", "cmpInforShow-more.html", {}, {
				cmpId: orgId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		//查看更多资源
		document.getElementById("seeMoreResource").addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/cmpInforShow-resources.html", "cmpInforShow-resources.html", {}, {
				cmpId: orgId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		//查看更多文章
		document.getElementById("seeMoreArtical").addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/cmpInforShow-article.html", "cmpInforShow-article.html", {}, {
				cmpId: orgId
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		mui('#articelShow').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			var ownerid = this.getAttribute("owner-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
				articleId: id,
				ownerid:ownerid,
				oFlag:1
			});
		})
		mui('#resourceShow').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
				resourceId: id
			});
		})
		
		
		function companyMessage(id) {
			mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data));
						var web = plus.webview.currentWebview()
						plus.nativeUI.closeWaiting();
						web.show("slide-in-right", 150);
						
						var $data = data.data;
						if($data.forShort){
							document.getElementById("companyNameT").innerText = $data.forShort;
							document.getElementById("companyName").innerText = $data.forShort;
						}else{
							document.getElementById("companyNameT").innerText = $data.name;
							document.getElementById("companyName").innerText = $data.name;
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
							document.getElementById("address").parentNode.style.display = "none";
						}

						/*企业简介*/
						if($data.descp) {
							document.getElementById("breifinfo").innerText = $data.descp;
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
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
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
		
		//获取资源
		function getResource() {
			mui.ajax(baseUrl + "/ajax/resource/pqOrgPublish", {
				type: "GET",
				timeout: 10000,
				dataType: "json",
				data: {
					"orgId": orgId,
					"pageSize": 1000,
					"pageNo": 1
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							document.getElementById("resourceNum").innerText = obj.length;
							if(obj.length>2){
								obj.length =2;
								document.getElementById("seeMoreResource").classList.remove("displayNone");
							}
							for(var i = 0; i < obj.length; i++) {
								var liItem = document.createElement("li");
								liItem.className = "mui-table-view-cell"
								liItem.setAttribute("data-id",obj[i].resourceId)
								var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
								if(obj[i].images.length) {
									oString += '<div class="madiaHead resouseHead" style="background-image:url(' + baseUrl + '/data/resource/' + obj[i].images[0].imageSrc +')"></div>'
								} else {
									oString += '<div class="madiaHead resouseHead"></div>'
								}
								oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis">应用用途：' + obj[i].supportedServices + '</p>'
								oString += '</div></div>'
								liItem.innerHTML = oString;
								document.getElementById("resourceShow").appendChild(liItem);
							}
						}else{
							document.getElementById("resourceShow").parentNode.parentNode.style.display="none";
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
		function getArticel() {
			mui.ajax(baseUrl + "/ajax/article/pqOrgPublish", {
				type: "GET",
				timeout: 10000,
				dataType: "json",
				data: {
					"orgId": orgId,
					"pageSize": 1000,
					"pageNo": 1
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							document.getElementById("articalNum").innerText = obj.length;
							if(obj.length>2){
								obj.length =2;
								document.getElementById("seeMoreArtical").classList.remove("displayNone");
							}
							for(var i = 0; i < obj.length; i++) {
								var liItem = document.createElement("li");
								liItem.setAttribute("data-id",obj[i].articleId);
								liItem.setAttribute("owner-id",obj[i].orgId);
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
						}else{
							document.getElementById("articelShow").parentNode.parentNode.style.display="none";
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
		
		//判断是否登录，登录才可咨询，关注，收藏
		function isLogin() {
			var userid = plus.storage.getItem('userid');
	         if(userid==null || userid=='null'|userid == undefined |userid == 'undefined'){
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
	
			var oUrl=baseUrl + "/images/logo180.png";
			if(document.getElementById("oimg").src !="../images/default-icon.jpg"){
				oUrl= document.getElementById("oimg").src;
			}
			if(oFen == "微信好友") {
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: document.getElementById("industryShow").innerHTML.substr(0,40),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId ,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "微信朋友圈") {
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: document.getElementById("industryShow").innerHTML.substr(0,40),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId ,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "新浪微博") {
				var share = buildShareService("sinaweibo");
				if(share) {
					shareMessage(share, "sinaweibo", {
						content: document.getElementById("companyName").innerHTML+ baseUrl + "/e/c.html?id=" + orgId ,
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
					shareAddIntegral(2);
				}
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
		 moreMes();
	function moreMes(){
		document.getElementById("BtnMore").addEventListener("tap",function(){
			var oUrl=baseUrl + "/images/logo180.png";
			if(document.getElementById("oimg").src !="../images/default-icon.jpg"){
				oUrl= document.getElementById("oimg").src;
			}
			plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
			proid: orgId,
			name:"org",
			data:{
						content: document.getElementById("industryShow").innerHTML.substr(0,40),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId ,
						thumbs: [oUrl]
					},
			weiboData:{
						content: document.getElementById("companyName").innerHTML+ baseUrl + "/e/c.html?id=" + orgId ,
					}
		})
		})
	}
	window.addEventListener("newId", function(event) {
			plus.navigator.setStatusBarBackground( "#28b8fa" );
		})
	document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
		plus.navigator.setStatusBarBackground( "#FF9900" );
	})
	});

})