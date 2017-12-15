
mui.ready(function() {
	mui.plusReady(function() {
		plus.navigator.setStatusBarBackground( "#28b8fa" );
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		companyMessage(orgId);
		getArticel();
		getResource();
		relevantarticalList();//相关文章
		likeExperts();//感兴趣企业
		enterprise();
		mui.ajax(baseUrl + '/ajax/org/incPageViews',{
			"type": "POST",
			"dataType": "json",
			"data": {
				"id": orgId
			},
			"success": function(data) {
				if(data.success) {}
			},
			"error": function() {
				
			}
		});
		//点击收藏按钮
		var oifAttend=document.getElementById("ifAttend")
		ifcollectionAbout(orgId,oifAttend,6);
		document.getElementById("collectBtn").addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(oifAttend.className=='mui-icon iconfontnew icon-yishoucang'){
					cancelCollectionAbout(orgId,oifAttend,6)
				} else {
					collectionAbout(orgId,oifAttend,6);
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
		mui('#likePro').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow1=plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
				cmpId: id
			});
			webviewShow1.addEventListener("loaded", function() {
				setTimeout(function(){plus.webview.currentWebview().close()},1000)
				
			}, false);
		})
		mui('#relateArt').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			var ownerid = this.getAttribute("owner-id");
			var datatype = this.getAttribute("data-type");
			if(datatype == 1) {
				plus.nativeUI.showWaiting();
				var webviewShow=plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
				});
			} else if(datatype == 2) {
				plus.nativeUI.showWaiting();
				var webviewShow=plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
					oFlag: 1
				});
			}
		})
		function enterprise(){
		mui.ajax(baseUrl + "/ajax/demand/pq", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data:{
				"state":1,
				"oid":orgId
			},
			success: function(data) {
				console.log(JSON.stringify(data)); 	
				if(data.success){
					var obj = data.data.data;
					if(obj.length>0){
						for(var i=0;i<obj.length;i++){
							var li = document.createElement("li");
							li.setAttribute("id",obj[i].id);
							var needDate=obj[i].invalidDay;
							var lastDate=TimeTr(needDate);
							li.className = "mui-table-view-cell";
							var oString = '<div class="madiaInfo">'
								oString += '<p class="h1Font mui-ellipsis-2">'+obj[i].title+'</p>';
								oString += '<p class="h2Font mui-ellipsis-5">'+obj[i].descp+'</p>'
								oString += '<div class="showli mui-ellipsis h3Font">'
								oString += '<span>'+obj[i].province+'</span>'
								if(obj[i].duration!=0){oString += '<span>预期 '+demandDuration[obj[i].duration]+'</span>'}
								if(obj[i].cost!=0){oString += '<span>预算 '+demandCost[obj[i].cost]+'</span>'}
								oString += '<span>有效期至'+lastDate+' </span>'
							    oString += '</div>'
								oString += '</div>'
							
								li.innerHTML = oString;
								document.getElementById("bower_u").appendChild(li);
							
						}
					}else{
						document.getElementById("bower_u").parentNode.parentNode.style.display = "none";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		})
		
	}
		mui("#bower_u").on("tap","li",function(){
		var dId=this.getAttribute("id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
			demanid: dId
		});
	})
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
						if($data.forShort){
							document.getElementById("companyNameT").innerText = $data.forShort;
							document.getElementById("companyName").innerText = $data.forShort;
						}else{
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
						}else{
							document.getElementById("breifinfo").parentNode.style.display = "none";
							document.getElementById("goCmpBrief").style.borderBottomColor="transparent";
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
					"pageSize": 10,
					"pageNo": 1
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							document.getElementById("resourceNum").innerText = data.data.total;
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
								oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis h1Font">' + obj[i].resourceName + '</p><p class="h2Font mui-ellipsis-2">用途：' + obj[i].supportedServices + '</p>'
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
					"pageSize": 10,
					"pageNo": 1
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							document.getElementById("articalNum").innerText = data.data.total;
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
								oString += '<p class="h2Font mui-ellipsis"><span class="time">'+commenTime(obj[i].publishTime)+'</span></p>'
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
		//相关文章信息
		function relevantarticalList(){
			mui.ajax(baseUrl + "/ajax/article/byAssOrg", {
				"type" :  "GET" ,
				"dataType" : "json",
				"data" :{"id":orgId},
				"async":"false",
				"traditional": true, //传数组必须加这个
				"success" : function(data) {
					console.log(JSON.stringify(data));
					if (data.success && data.data!=""){
						document.getElementById("relateArt").parentNode.parentNode.classList.remove("displayNone");
						document.getElementById("relateArt").innerHTML="";
						var StrData = data.data
						var lengthT;
						if(data.data.length>5){
							lengthT=5;
						}else{
							lengthT=data.data.length
						}
						for(var i = 0; i < lengthT; i++) {
							(function(n) {
								var imgL="../images/default-artical.jpg";
								if(StrData[i].articleImg){
									imgL=baseUrl+'/data/article/' + StrData[i].articleImg 
								}
								var oURL;
								if(StrData[i].articleType==1) {
									oURL="/ajax/professor/baseInfo/"+StrData[i].professorId;
								}else{
									oURL="/ajax/org/" + StrData[i].orgId;
								}
								mui.ajax(baseUrl + oURL, {
									"type": "GET",
									'dataType': "json",
									"success": function(data) {
										if(data.success) {
											console.log(JSON.stringify(data));
											var add = document.createElement("li");
											add.className = "mui-table-view-cell"; 
											add.setAttribute("data-id",StrData[n].articleId);
											var thisName,userType,thisAuth,thisTitle
											if(data.data.forShort){
												thisName=data.data.forShort;
											}else{
												thisName=data.data.name;
											}
											if(StrData[n].articleType==1) {
												add.setAttribute("owner-id", data.data.id);
												add.setAttribute("data-type", 1);
											}else {
												add.setAttribute("owner-id", data.data.id);
												add.setAttribute("data-type", 2);
											}
											
											var itemlist = '<div class="flexCenter OflexCenter mui-clearfix"><div class="madiaHead artHead" style="background-image:url('+imgL+')"></div>';
												itemlist += '<div class="madiaInfo OmadiaInfo">';
												itemlist += '<p class="mui-ellipsis-2 h1Font" id="usertitle">'+StrData[n].articleTitle+'</p>';
												itemlist += '<p><span class="h2Font" style="margin-right:10px">'+thisName+'</span><span class="time">'+commenTime(StrData[n].publishTime)+'</span></p>';
												itemlist += '</div></div>';
												
											add.innerHTML=itemlist;
											document.getElementById("relateArt").appendChild(add);
										}
									},
									error: function() {
										plus.nativeUI.toast("服务器链接超时", toastStyle);
										return;
									}
								});
							})(i);
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
	    
	    //感兴趣
		function likeExperts(){
			mui.ajax(baseUrl + "/ajax/org/ralateOrgs", {
				"type": "get",
				"dataType" : "json",
				"data" :{"orgId":orgId},
				"success": function(data) {
					if(data.success && data.data) {
						var lengthT;
						if(data.data.length>5){
							lengthT=5;
						}else{
							lengthT=data.data.length
						}
						for(var i = 0; i < lengthT; i++) {
							var ExpId = data.data[i].id;
							likeExpertsList(ExpId);
						}
						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//感兴趣
		function likeExpertsList(ExpId){
			mui.ajax(baseUrl +  "/ajax/org/"+ExpId, {
				"type" :  "GET" ,
				"dataType" : "json",
				"success" : function(data) {
					if (data.success && data.data!=""){
						document.getElementById("likePro").parentNode.parentNode.classList.remove("displayNone");	
						var add = document.createElement("li");
						add.setAttribute("data-id",data.data.id);
						add.className = "mui-table-view-cell";
						add.style.minHeight="68px";
						var imgL,thisName,thisAuth,thisTitle,otherI="";
						if(data.data.hasOrgLogo == 1) {
							imgL= baseUrl+"/images/org/" + data.data.id + ".jpg";
						}else{
							imgL='../images/default-icon.jpg'
						}
						if(data.data.forShort){
							thisName=data.data.forShort
						}else{
							thisName=data.data.name
						}
						if(data.data.industry){
							otherI=data.data.industry.replace(/,/gi, " | ");
						}
						if(data.data.authStatus==3){
							thisAuth="authicon-com-ok"
							thisTitle="科袖认证企业"
						}
						var itemlist = '<div class="flexCenter OflexCenter mui-clearfix"><div class="madiaHead cmpHead"><div class="boxBlock"><img class="boxBlockimg" src="'+imgL+'" /></div></div>';
							itemlist += '<div class="madiaInfo OmadiaInfo">';
							itemlist += '<p class="mui-ellipsis"><span class="mui-ellipsis h1Font">'+thisName+'</span><em class="authicon '+thisAuth+'" title="'+thisTitle+'"></em></p>';
							itemlist += '<p class="mui-ellipsis h2Font">'+otherI+'</p>';
							itemlist += '</div></div>';
						add.innerHTML=itemlist;
						document.getElementById("likePro").appendChild(add);
						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
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
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: document.getElementById("industryShow").innerHTML.substr(0,70),
						title: document.getElementById("companyName").innerHTML,
						href: baseUrl + "/e/c.html?id=" + orgId ,
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
						content: document.getElementById("industryShow").innerHTML.substr(0,70),
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