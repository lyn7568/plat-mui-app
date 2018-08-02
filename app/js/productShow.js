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
var oifCollect = document.getElementById("ifCollect")//星星

var professorId;
var orgId;
var resourceId
var imgFlag;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	resourceId = self.productId;
	getRecourceMe();/*获取资源信息*/
	relatedArticles();/*相关文章信息*/
	pageViewLog(resourceId,11)
	mui('#detailDescp').on('tap','a',function(){
		plus.runtime.openURL( this.href);
	});
	
	function getRecourceMe() {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/product/qo', {
				data: {
					'id': resourceId,
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if(data.success) {
						var mydata = data.data;
						oresourceTit.innerHTML = mydata.name;
						oresourceName.innerHTML = mydata.name;
						oapplication.innerHTML = "简介："+ mydata.cnt;
						if(mydata.spec) { //厂商型号
							omodelNumber.innerText = mydata.spec;
							omodelNumber.parentNode.style.display="block";
						}
						if(mydata.parameter) { //性能参数
							operformancePa.innerHTML = mydata.parameter.replace(/\n/gi,"<br />");
							operformancePa.parentNode.style.display="block";
						}
						if(mydata.producingArea) { //性能参数
							document.querySelector('#productArea').innerHTML = mydata.producingArea;
							document.querySelector('#productArea').parentNode.style.display="block";
						}
						if(mydata.price) { //性能参数
							document.querySelector('#officialPrice').innerHTML = mydata.price;
							document.querySelector('#officialPrice').parentNode.style.display="block";
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
						comOwner(mydata.owner)
						if(mydata.keywords) {
							var oSub = mydata.keywords.split(",");
							var oSt = "";
							for(var i = 0; i < oSub.length; i++) {
								oSt += '<li><span class="h2Font">' + oSub[i] + '</span></li>'
							}
							mui(".tagList")[0].innerHTML = oSt;
						} else {
							mui(".tagList")[0].style.display="none";
						}
						if(mydata.images) {
							mydata.images = mydata.images.split(',');
							imgFlag=1;
							var lastImg = document.getElementById("lastImg");;
							lastImg.innerHTML = '<a class="tab-re"><img src="'+ baseUrl+'/data/product' + mydata.images[mydata.images.length-1] + '" /></a>';
							
							var firstImg = document.getElementById("firstImg");
							firstImg.innerHTML = '<a class="tab-re"><img src="'+ baseUrl+'/data/product' + mydata.images[0]+ '" /></a>';
							for(var i = 0; i < mydata.images.length; i++) {
								var rPdiv = document.createElement("div");
								rPdiv.className = 'mui-slider-item';
								rPdiv.innerHTML ='<a class="tab-re"><img src="'+ baseUrl+'/data/product' + mydata.images[i] + '"/></a>'
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
	function isCompanyStaff(pid,par) {
		mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + pid, {
			type: "GET",
			dataType: "json",
			success: function(data) {
				if(data.success) {
					if(data.data.orgId === par) {
						document.getElementsByClassName('footbox')[0].style.display = "none";
					}
				}
			}
		});
	}
	function comOwner(pid) {
		mui.ajax(baseUrl + '/ajax/org/' + pid, {
			type: "GET",
			data: {
				"id": resourceId,
			},
			dataType: "json",
			success: function(data) {
				if(data.success) {
					var mydata={};
					mydata.organization = data.data;
					if(userid)
							isCompanyStaff(userid,mydata.organization.id)
							othisInfo.setAttribute("data-id",mydata.organization.id);
							othisInfo.setAttribute("data-status",mydata.organization.authStatus);
							othisInfo.setAttribute("data-type",mydata.resourceType);
							orgId = othisInfo.getAttribute("data-id");
							if(mydata.organization.forShort){
								othisName.innerHTML = mydata.organization.forShort;
							}else{
								othisName.innerHTML = mydata.organization.name;
							}
							if(userid) {
								ifcollectionAbout(orgId,oattenSpan, 6,1)
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
			}
		});
	}
	/*资源里面相关文章*/
	function relatedArticles() {
		mui.ajax(baseUrl + '/ajax/article/lq/byProduct', {
			type: "GET",
			data: {
				"product": resourceId,
				"rows": 5
			},
			dataType: "json",
			success: function(data) {
				if(data.success) {
					if(data.data.length == 0) {
						return;
					}
					document.getElementById("likeArtical").parentNode.classList.remove("displayNone");
					var $html= data.data;
					for(var i = 0; i < $html.length; i++) {
						(function(n) {
							mui.ajax(baseUrl+"/ajax/org/" + $html[i].ownerId, {
								type: "GET",
								dataType: "json",
								success: function(data) {
									if(data.success) {
										var likeRUl = document.getElementById("likeArtical");
										var likeRli = document.createElement("li");
										likeRli.className = 'mui-table-view-cell';
										likeRli.setAttribute("data-id", $html[n].articleId);
										var comName="";
											if(data.data.forShort){
												comName=data.data.forShort;
											}else{
												comName=data.data.name;
											}
											likeRli.setAttribute("data-type", 2);
										var str = '<div class="flexCenter OflexCenter">'
										if($html[n].articleImg) {
											str += '<div class="madiaHead artHead" style="background-image: url('+ baseUrl +'/data/article/' + $html[n].articleImg + ')"></div>'
										} else {
											str += '<div class="madiaHead artHead"></div>'
										}
										str += '<div class="madiaInfo OmadiaInfo">'
										str += '<p class="mui-ellipsis-2 h1Font">' + $html[n].articleTitle + '</p>'
										str += '<p class="h2Font mui-ellipsis">'
										str +='<span class="nameSpan" style="margin-right:10px">' + comName + '</span>'
										str +='<span class="time">'+commenTime($html[n].publishTime)+'</span>'
										str +='</p>'
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
			}
		});
	}
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
			//var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			var wechat=plus.webview.getWebviewById('weChat.html');
			var jubao=plus.webview.getWebviewById('jubao.html');
			
			if(wechat) {
				wechat.close();
			}
			if(jubao) {
				jubao.close()
			}
			setTimeout(function(){
				mui.ajax(baseUrl + '/ajax/product/pro', {
					data: {
						"id": resourceId,
					},
					dataType: 'json', //数据格式类型
					type: "GET",
					success: function(data) {
						if(data.success){
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
									flag:1
								}
							})
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			},100);
		}
	});

	//点击关注专家按钮
	oattenSpan.addEventListener('tap', function() {
		var typeNum=othisInfo.getAttribute("data-type");
		var thisId=othisInfo.getAttribute("data-id");
		if(userid && userid != null && userid != "null") {
			if(typeNum==1){
				if(this.className=='mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(thisId,this, 1,1)
				} else {
					collectionAbout(thisId,this, 1,1);
				}
			}else{
				if(this.className=='mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(thisId,this, 6,1)
				} else {
					collectionAbout(thisId,this, 6,1);
				}
			}
					
		}else{
			isLogin();
		}
	});
	//点击收藏按钮
	ifcollectionAbout(resourceId,oifCollect,11);
	ocollectBtn.addEventListener('tap', function() {
		if(userid && userid != null && userid != "null") {
			if(oifCollect.className=='mui-icon iconfontnew icon-yishoucang'){
				cancelCollectionAbout(resourceId,oifCollect,11);
			} else {
				collectionAbout(resourceId,oifCollect,11);
			}
		}else{
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
			if(!weixinClient()) {
					return;
				}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/pr.html?id=" + resourceId ,
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
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/pr.html?id=" + resourceId  ,
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
			name:"product",
			data:{
					content: oapplication.innerHTML,
					title: oresourceName.innerHTML,
					href: baseUrl + "/e/pr.html?id=" + resourceId ,
					thumbs: [oUrl]
				},
			weiboData:{
					content: oresourceName.innerHTML+ baseUrl + "/e/pr.html?id=" + resourceId,
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