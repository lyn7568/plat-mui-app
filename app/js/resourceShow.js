//资源信息页面 
var oresourceTit = document.getElementById("resourceTit"); //资源名称标题

var othisInfo=document.getElementById("thisInfo"); //用户/企业信息
var othisName = document.getElementById("thisName"); //专家名称
var othisOther = document.getElementById("thisOther"); //专家职称/职位
var oauthFlag = document.getElementById("authFlag"); //专家认证
var othisPic = document.getElementById("thisPic"); //专家头像

var oresorcePic = document.getElementById("resorcePic"); //资源图片
var oresourceName = document.getElementById("resourceName"); //资源名称
var oapplication = document.getElementById("application"); //应用用途
var oresorceOrg = document.getElementById("resorceOrg"); //资源所属机构
var omodelNumber = document.getElementById("modelNumber"); //厂商型号
var operformancePa = document.getElementById("performancePa"); //性能参数
var oremarkContent = document.getElementById("remarkContent"); //合作备注
var odetailDescp = document.getElementById("detailDescp"); //详细描述

var oconsultBtn = document.getElementById("consultBtn"); //咨询按钮
var ocollectBtn = document.getElementById("collectBtn"); //收藏按钮
var oattenSpan = document.getElementById("attenSpan"); //关注用户按钮

var professorId;
var orgId;
var resourceId
var imgFlag;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	resourceId = self.resourceId;
	getRecourceMe();/*获取资源信息*/
	relatedArticles();/*相关文章信息*/
	interestingResources();
	
	mui.ajax(baseUrl + '/ajax/resource/pageViews',{
			"type": "POST",
			"dataType": "json",
			"data": {
				"resourceId": resourceId
			},
			"success": function(data) {
				if(data.success) {}
			},
			"error": function() {
				
			}
		});
	function getRecourceMe() {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/resource/queryOne', {
				data: {
					'resourceId': resourceId,
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if(data.success) {
						var mydata = data.data;
						oresourceTit.innerHTML = mydata.resourceName;
						oresourceName.innerHTML = mydata.resourceName;
						oapplication.innerHTML = "用途："+ mydata.supportedServices;
						if(mydata.editProfessor) {
							othisInfo.setAttribute("data-id",mydata.editProfessor.id);
							othisInfo.setAttribute("data-type",mydata.resourceType);
							professorId = othisInfo.getAttribute("data-id");
							if(userid != professorId) {
								ifcollectionAbout(professorId, 1)
								oattenSpan.style.display="block";
							}else{
								document.getElementsByClassName('footbox')[0].style.display = "none";
							}
							if(mydata.orgName) { //所属机构
								oresorceOrg.innerText = mydata.orgName;
								oresorceOrg.parentNode.style.display="block";
							}
							//用户个人信息
							othisName.innerHTML = mydata.editProfessor.name;
							var otitleInfo="";
							var oOrgInfo="";
							if(mydata.editProfessor.title) {
								otitleInfo = mydata.editProfessor.title + ",";
							} else {
								if(mydata.editProfessor.office) {
									otitleInfo = mydata.editProfessor.office + ",";
								}else{
									otitleInfo = "";
								}
							}
							if(mydata.editProfessor.orgName) {
								oOrgInfo = mydata.editProfessor.orgName;
							}
							othisOther.innerHTML = otitleInfo + oOrgInfo;
							
							var professorFlag = autho(mydata.editProfessor.authType, mydata.editProfessor.orgAuth, mydata.editProfessor.authStatus);
							oauthFlag.classList.add(professorFlag.sty);
							othisPic.classList.add("useHead");
							if(mydata.editProfessor.hasHeadImage == 1) {
								othisPic.style.backgroundImage = 'url('+ baseUrl +'/images/head/' + mydata.editProfessor.id + '_l.jpg)';
							}
						}else{
							othisInfo.setAttribute("data-id",mydata.organization.id);
							othisInfo.setAttribute("data-status",mydata.organization.authStatus);
							othisInfo.setAttribute("data-type",mydata.resourceType);
							if(mydata.organization.forShort){
								othisName.innerHTML = mydata.organization.forShort;
							}else{
								othisName.innerHTML = mydata.organization.name;
							}
							if(mydata.organization.subject) {
								othisOther.innerHTML = (mydata.organization.subject).replace(/,/, " | ");
							}
							othisPic.classList.add("cmpHead2");
							othisPic.innerHTML='<div class="boxBlock"><img class="boxBlockimg" id="companyImg" src="../images/default-icon.jpg"></div>'
							if(mydata.organization.hasOrgLogo) {
								document.getElementById("companyImg").src= baseUrl + "/images/org/" + mydata.organization.id + ".jpg";
							}
							if(mydata.organization.authStatus==3){
								oauthFlag.classList.add("authicon-com-ok");	
							}
						}
						if(mydata.spec) { //厂商型号
							omodelNumber.innerText = mydata.spec;
							omodelNumber.parentNode.style.display="block";
						}
						if(mydata.parameter) { //性能参数
							operformancePa.innerHTML = mydata.parameter.replace(/\n/gi,"<br />");
							operformancePa.parentNode.style.display="block";
						}
						if(mydata.cooperationNotes) { //合作备注
							oremarkContent.innerHTML = mydata.cooperationNotes.replace(/\n/gi,"<br />");
							oremarkContent.parentNode.style.display="block";
						}
						if(mydata.descp) { //详细描述
							odetailDescp.innerHTML = mydata.descp;
							odetailDescp.parentNode.style.display="block";
							var oImg = odetailDescp.getElementsByTagName("img");
							for(var i = 0; i < oImg.length; i++) {
								(function(n) {
									var att = oImg[n].src.substr(7);
									oImg[n].setAttribute("src", baseUrl + att);
								})(i);
							}
						}
						if(mydata.subject) {
							var oSub = mydata.subject.split(",");
							var oSt = "";
							for(var i = 0; i < oSub.length; i++) {
								oSt += '<li><span class="h2Font">' + oSub[i] + '</span></li>'
							}
							mui(".tagList")[0].innerHTML = oSt;
						} else {
							document.getElementById("likeResource").parentNode.style.display="none";
						}
						if(mydata.images.length) {
							imgFlag=1;
							var lastImg = document.getElementById("lastImg");;
							lastImg.innerHTML = '<a class="tab-re"><img src="'+ baseUrl+'/data/resource/' + mydata.images[mydata.images.length-1].imageSrc + '" /></a>';
							
							var firstImg = document.getElementById("firstImg");
							firstImg.innerHTML = '<a class="tab-re"><img src="'+ baseUrl+'/data/resource/' + mydata.images[0].imageSrc + '" /></a>';
							for(var i = 0; i < mydata.images.length; i++) {
								var rPdiv = document.createElement("div");
								rPdiv.className = 'mui-slider-item';
								rPdiv.innerHTML ='<a class="tab-re"><img src="'+ baseUrl+'/data/resource/' + mydata.images[i].imageSrc + '"/></a>'
								oresorcePic.appendChild(rPdiv,oresorcePic.firstChild);
							}
							for(var i = 1; i < mydata.images.length; i++){	
								var resorcePoint = document.getElementById("resorcePoint");
								var rPoint = document.createElement("div");
								rPoint.className = 'mui-indicator';
								resorcePoint.appendChild(rPoint);
							}
							oresorcePic.insertBefore(lastImg,oresorcePic.firstChild);
							oresorcePic.appendChild(firstImg,oresorcePic.lastChild);
						}else {
							document.getElementById('slider').style.display="none";
							imgFlag=2;
						}
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		})
	}
	//关键词标签点击进去搜索
	mui(".tagList").on("tap","li",function(){
		var tagText = this.getElementsByTagName("span")[0].innerText;
		 plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=3", "../html/searchListNew2.html", {}, {
			key: tagText,
			qiFlag: 2
		}); 
	})
	/*资源里面相关文章*/
	function relatedArticles() {
		mui.ajax(baseUrl + '/ajax/article/byAssResource', {
			type: "GET",
			data: {
				"id": resourceId,
			},
			dataType: "json",
			success: function(data) {
				if(data.success) {
					if(data.data.length == 0) {
						return;
					}
					document.getElementById("likeArtical").parentNode.classList.remove("displayNone");
					var $html= data.data;
					var lengthT;
					if($html.length>5){
						lengthT=5;
					}else{
						lengthT=$html.length
					}
					for(var i = 0; i < lengthT; i++) {
						(function(n) {
							var oURL;
							if($html[i].articleType==1) {
								oURL=baseUrl+"/ajax/professor/baseInfo/" + $html[i].professorId;
							}else{
								oURL=baseUrl+"/ajax/org/" + $html[i].orgId;
							}
							mui.ajax(oURL, {
								type: "GET",
								dataType: "json",
								success: function(data) {
									if(data.success) {
										var likeRUl = document.getElementById("likeArtical");
										var likeRli = document.createElement("li");
										likeRli.className = 'mui-table-view-cell';
										likeRli.setAttribute("data-id", $html[n].articleId);
										
										var comName="";
										if($html[n].articleType==1) {
											var stl = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
											comName=data.data.name;
											likeRli.setAttribute("data-type", 1);
										}else {
											var stl={};
											stl.sty="";
											stl.title="";
											if(data.data.authStatus==3) {
												stl.sty="authicon-com-ok";
												stl.title="认证企业";
											}
											if(data.data.forShort){
												comName=data.data.forShort;
											}else{
												comName=data.data.name;
											}
											likeRli.setAttribute("data-type", 2);
										}
										
										var str = ""
										str+='<div class="flexCenter OflexCenter mui-clearfix">'
										if($html[n].articleImg) {
											str += '<div class="madiaHead artHead" style="background-image: url('+ baseUrl +'/data/article/' + $html[n].articleImg + ')"></div>'
										} else {
											str += '<div class="madiaHead artHead"></div>'
										}
										str += '<div class="madiaInfo OmadiaInfo">'
										str += '<p class="mui-ellipsis-2 h1Font">' + $html[n].articleTitle + '</p>'
										str += '<p><span class="h2Font">' + comName + '</span><em class="authicon ' + stl.sty + '" title="' + stl.title + '"></em></p>'
										str += '</div></div>'
										likeRli.innerHTML = str;
										likeRUl.appendChild(likeRli,likeRUl.lastChild);
									}
								},
								error: function(xhr, type, errorThrown) {
									plus.nativeUI.toast("服务器链接超时", toastStyle);
								}
							});
						})(i);
				
					}
				}
			},
			error:  function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}
	/*感兴趣的资源*/
	function interestingResources() {
		mui.ajax(baseUrl+"/ajax/resource/ralateResources",{
			data: {"resourceId": resourceId},
			dataType: "json",
			traditional: true,
			type: 'get', //HTTP请求类型
			success: function(data) {
				if(data.success) {
					console.log(JSON.stringify(data))
					if(data.data.length == 0) {
						return;
					}
					document.getElementById("likeResource").parentNode.classList.remove("displayNone");
					var $respond=data.data;
					var lengthT;
					if($respond.length>5){
						lengthT=5;
					}else{
						lengthT=$respond.length
					}
					for(var i = 0; i < lengthT; i++) {
						(function(n) {
							var imgL="../images/default-resource.jpg";
							if($respond[i].images.length){
								imgL=baseUrl+'/data/resource/' + $respond[i].images[0].imageSrc
							}
							var oURL;
							if($respond[i].resourceType==1) {
								oURL="/ajax/professor/baseInfo/"+$respond[i].professorId;
							}else{
								oURL="/ajax/org/" + $respond[i].orgId;
							}
							mui.ajax(baseUrl+oURL,{
								"type": "GET",
								'dataType': "json",
								"success": function(data) {
									if(data.success){
										console.log(JSON.stringify(data))
										var thisName,userType,thisAuth,thisTitle
										if(data.data.forShort){
											thisName=data.data.forShort;
										}else{
											thisName=data.data.name;
										}
										if($respond.resourceType==1) {
											userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
											thisTitle = userType.title;
											thisAuth = userType.sty;
										}else {
											if(data.data.authStatus==3) {
												thisTitle = "科袖认证企业";
												thisAuth = "authicon-com-ok";
											}
										}
										var add = document.createElement("li");
										add.className = "mui-table-view-cell"; 
										add.setAttribute("data-id",$respond[n].resourceId);
										var itemlist = '<div class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url('+imgL+')"></div>';
											itemlist += '<div class="madiaInfo OmadiaInfo">';
											itemlist += '<p class="mui-ellipsis h2Font" id="usertitle">'+$respond[n].resourceName+'</p>';
											itemlist += '<p><span class="h1Font">'+thisName+'</span><em class="authicon '+thisAuth+'" title="'+thisTitle+'"></em></p>';
											itemlist += '</div></div>';
											
										add.innerHTML=itemlist;
										document.getElementById("likeResource").appendChild(add);
									}
								},
								'error': function(xhr, type, errorThrown) {
									plus.nativeUI.toast("服务器链接超时", toastStyle);
								}
							});
						})(i);
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	//进入资源发布者详情页面
	othisInfo.addEventListener("tap", function() {
		var reType = this.getAttribute("data-type");
		if(reType=="1"){
			mui.openWindow({
				url: '../html/userInforShow.html',
				id: 'html/userInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-left"
				},
				extras: {
					proid: professorId
				},
			});
		}else{
			var cmpId=this.getAttribute("data-id");
			mui.openWindow({
				url: '../html/cmpInforShow.html',
				id: 'cmpInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					cmpId: cmpId,
				}
			});
		}
		
			
	})
	//相关文章详情
	mui('#likeArtical').on('tap', 'li', function() {
		var artId = this.getAttribute("data-id");
		var ownId = othisInfo.getAttribute("data-id");
		var typeN = this.getAttribute("data-type");
		if(typeN==1){
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
				articleId: artId,
				ownerid: ownId
			});
		}else{
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
				articleId: artId,
				ownerid: ownId,
				flag:1
			});
		}
		
	});
	//感兴趣的资源详情
	mui('#likeResource').on('tap', 'li', function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		var webviewShow=plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
		webviewShow.addEventListener("loaded", function() {
				setTimeout(function(){plus.webview.currentWebview().close()},1000)
				
			}, false);
	});
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
	//咨询
	oconsultBtn.addEventListener('tap', function() {
		var reType = othisInfo.getAttribute("data-type");
		
		isLogin();
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			var flag = 'ziyuan';
			var consulttitle = oresourceName.innerHTML;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			if(reType=="1"){
				webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
					'proId': professorId,
					'flag': flag,
					'consulttitle': consulttitle
				});
				webviewShow.addEventListener("loaded", function() {

				}, false);
			}else{
				mui.ajax(baseUrl + '/ajax/resource/qaLinkman', {
					data: {
						"resourceId": resourceId,
					},
					dataType: 'json', //数据格式类型
					type: "GET",
					success: function(data) {
						if(data.success){
							console.log(JSON.stringify(data))
							var linkProfirstId = data.data[0].professorId;
							var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
							webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
								'proId': linkProfirstId,
								'flag': flag,
								'consulttitle': consulttitle
							});
							webviewShow.addEventListener("loaded", function() {
	
							}, false);
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			}
		}
	});

	//点击关注专家按钮
	oattenSpan.addEventListener('tap', function() {
		if(userid && userid != null && userid != "null") {
			if(this.className=='mui-icon attenSpan attenedSpan') {
				cancelCollectionAbout(professorId, 1)
			} else {
				collectionAbout(professorId, 1);
			}
		}else{
			isLogin();
		}
	});
	//点击收藏按钮
	ifcollectionAbout(resourceId,2);
	ocollectBtn.addEventListener('tap', function() {
		if(userid && userid != null && userid != "null") {
			if(document.getElementById("ifCollect").className=='mui-icon iconfontnew icon-yishoucang'){
				cancelCollectionAbout(resourceId, 2)
			} else {
				collectionAbout(resourceId, 2);
			}
		}else{
			isLogin();
		}
	});
	/*判断是否收藏资源文章或者是否关注专家*/
	function ifcollectionAbout(watchObject,num) {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": watchObject
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					if(num=="1"){//已关注专家
						oattenSpan.classList.add("attenedSpan");
						oattenSpan.innerText="已关注";
					}else{//已收藏资源或文章
						document.getElementById("ifCollect").classList.remove("icon-shoucang");
						document.getElementById("ifCollect").classList.add("icon-yishoucang");
					}
				} else {
					if(num=="1"){//关注专家
						oattenSpan.classList.remove("attenedSpan");
						oattenSpan.innerText="关注";
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.add("icon-shoucang");
						document.getElementById("ifCollect").classList.remove("icon-yishoucang");
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏资源、文章或者关注专家*/
	function collectionAbout(watchObject, num) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": watchObject,
				"watchType": num
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success) {
					if(num=="1"){//关注专家
						oattenSpan.classList.add("attenedSpan");
						oattenSpan.innerText="已关注";
						plus.nativeUI.toast("关注成功", toastStyle);
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.remove("icon-shoucang");
						document.getElementById("ifCollect").classList.add("icon-yishoucang");
						plus.nativeUI.toast("收藏成功", toastStyle);
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏资源、文章或者取消关注专家*/
	function cancelCollectionAbout(watchObject, num) {
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: watchObject
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					if(num=="1"){//关注专家
						oattenSpan.classList.remove("attenedSpan");
						oattenSpan.innerText="关注";
						plus.nativeUI.toast("已取消关注", toastStyle);
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.add("icon-shoucang");
						document.getElementById("ifCollect").classList.remove("icon-yishoucang");
						plus.nativeUI.toast("已取消收藏", toastStyle);
					}
					
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}
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
//		var pictureS = oresorcePic.getElementsByTagName("img");
//		var imageStr = "";
//		for(var i=0;i<pictureS.length;i++){
//		   imageStr+=pictureS[i].src+";";
//		}
		var oUrl=baseUrl + "/images/logo180.png";
		if(imgFlag==1) {
			oUrl=firstImg.querySelectorAll("img")[0].getAttribute("src").replace(/.jpg/,"_s.jpg");
		}
		if(oFen == "微信好友") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/r.html?id=" + resourceId ,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "微信朋友圈") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/r.html?id=" + resourceId  ,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: oresourceName.innerHTML+ baseUrl + "/e/r.html?id=" + resourceId,
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
				shareAddIntegral(2);
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
		if(imgFlag==1) {
			oUrl=firstImg.querySelectorAll("img")[0].getAttribute("src").replace(/.jpg/,"_s.jpg");
		}
			plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
			proid: resourceId,
			name:"resource",
			data:{
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/r.html?id=" + resourceId ,
					thumbs: [oUrl]
				},
			weiboData:{
					content: oresourceName.innerHTML+ baseUrl + "/e/r.html?id=" + resourceId,
				}
		})
		})
	}
	document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
			var web1 = plus.webview.getWebviewById("cmpInforShow-resource.html");
			if(!web1){
				if(web) 
				mui.fire(web, "newId",{
									rd: 1
							});
			}
	})
});